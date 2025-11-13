(() => {
    class MyError extends Error {}

    function recordError(errMessage, fn) {
        try {
            return fn();
        } catch (e) {
            console.error(e);
            throw new MyError(errMessage);
        }
    }

    async function recordErrorAsync(errMessage, fn) {
        try {
            return await fn();
        } catch (e) {
            console.error(e);
            throw new MyError(errMessage);
        }
    }
    
    class HttpRequestDataRaw {
        constructor(action, url, httpVersion, headers, body) {
            const obj = { action, url, httpVersion, headers, body };
            Object.assign(this, obj);
        }
    }

    class HttpRequestData {
        constructor(raw, url) {
            const { action, httpVersion, headers, body } = raw;
            const obj = { action, url, httpVersion, headers, body: body.length == 0 ? undefined : body };
            Object.assign(this, obj);
        }
    }

    async function executeHttpRequest(data) {
        const headers = new Headers();
        for (const { name, value } of data.headers) {
            headers.append(name, value);
        }

        const response = await recordErrorAsync(
            "Error while executing HTTP request",
            () => fetch(data.url, {
                method: data.method,
                headers: headers,
                body: data.body
            })
        );

        return response;
    }

    const validateHttpRequest = (() => {
        const actions = ["GET", "POST", "PUT", "DELETE"];
        const httpVersions = ["??"];
        return function validateHttpRequest(data) {
            if (!actions.includes(data.action)) {
                throw new MyError("Request action is not included in list of allowed actions");
            }

            if (!httpVersions.includes(data.httpVersion)) {
                throw new MyError("Request HTTP version is not included in list of allowed HTTP versions");
            }

            const url = new URL(data.url);

            return new HttpRequestData(data, url);
        }
    })();

    const parseHttpRequest = (() => {
        const startLineRE = /^([^ ]+) ([^ ]+) HTTP\/([^ ]+)$/g;
        const headerRE = /^([^ ]+): ?(.*)$/g;

        function processStartLine(line) {
            if (line == undefined) {
                throw new MyError("There is no start line");
            }

            const match = line.matchAll(startLineRE).next().value;

            if (match == undefined) {
                throw new MyError("Start line does not match pattern");
            }

            return { action: match[1], url: match[2], httpVersion: match[3] };
        }

        function processHeaders(iter) {
            const headers = [];

            for (const line of iter) {
                if (line.trim().length <= 0) {
                    break;
                }

                const match = line.matchAll(headerRE).next().value;
                

                if (match == undefined) {
                    throw new MyError("Start line does not match pattern");
                }

                const newHeader = { name: match[1], value: match[2] };
                headers.push(newHeader);
            }

            return headers;
        }

        return function parseHttpRequest(txt) {
            const lines = txt.replace("\r", "").split("\n")[Symbol.iterator]();
            
            const startLine = processStartLine(lines.next().value);

            const headers = processHeaders(lines);

            const body = Array.from(lines).join("\n");

            const result = new HttpRequestDataRaw(startLine.action, startLine.url, startLine.httpVersion, headers, body);

            return result;
        };
    })();

    const byteToText = (() => {
        function processByte(byte) {
            if (byte >= 0x21 && byte <= 0x7e) {
                return {
                    _class: "normal",
                    content: String.fromCharCode(byte)
                };
            } else if (byte === 0x0a) {
                return {
                    _class: "special-lf",
                    content: "\\n",
                    lineFeed: true
                };
            } else if (byte === 0x0d) {
                return {
                    _class: "special-cr",
                    content: "\\r"
                };
            } else if (byte === 0x20) {
                return {
                    _class: "special-space",
                    content: " "
                };
            } else if (byte === 0x09) {
                return {
                    _class: "special-tab",
                    content: "\t"
                };
            } else {
                const v = byte.toString(16);
                return {
                    _class: "special",
                    content: `\\x${v}`
                };
            }

        }
        
        return function byteToText(byte) {
            const { _class, content, lineFeed } = processByte(byte);

            const res = document.createElement("span");
            res.classList.add(_class);
            res.textContent = content;

            if (lineFeed) {
                return [res, document.createElement("br")];
            } else {
                return [res];
            }
        };
    })();

    async function uint8ArrayToHtmlElements(array, callback) {
        for await (const byte of array) {
            for (const el of byteToText(byte)) {
                callback(el);
            }
        }
    }

    async function responseToText(response) {
        const elements = [];

        const startLine = document.createElement("span");
        startLine.textContent = `HTTP/?? ${response.status} ${response.statusText}`;
        elements.push(startLine);
        elements.push(document.createElement("br"));

        for (const [name, value] of response.headers.entries()) {
            const line = document.createElement("span");
            line.textContent = `${name}: ${value}`;
            elements.push(line);
            elements.push(document.createElement("br"));
        }

        elements.push(document.createElement("br"));

        const buffer = await response.arrayBuffer();
        const bodyBytes = new Uint8Array(buffer);
        await uint8ArrayToHtmlElements(bodyBytes, (el) => elements.push(el));
        
        console.log(elements);

        return elements;
    }

    const inputTextarea = document.getElementById("input-textarea");
    const inputSubmit = document.getElementById("input-submit");
    const outputPre = document.getElementById("output-pre");
    const outputBack = document.getElementById("output-back");
    const errorPre = document.getElementById("error-pre");
    const errorBack = document.getElementById("error-back");

    function showMessageInErrorView(msg) {
        errorPre.textContent = msg;
        document.body.setAttribute("show-error", "");
    }

    errorBack.addEventListener("click", () => {
        document.body.removeAttribute("show-error");
    });

    async function recordErrorInDOM(fn) {
        try {
            return await fn();
        } catch (e) {
            if (e instanceof MyError) {
                showMessageInErrorView(e.message);
            } else {
                throw e;
            }
        }
    }

    inputSubmit.addEventListener("click", () => {
        recordErrorInDOM(
            async () => {
                const text = inputTextarea.value;
                const rawRequest = parseHttpRequest(text);
                const request = validateHttpRequest(rawRequest);
                const response = await executeHttpRequest(request);
                console.log(response);
                const elements = await responseToText(response);
                outputPre.textContent = "";
                outputPre.append(...elements);
                document.body.setAttribute("show-output", "");
            }
        );
    });

    outputBack.addEventListener("click", () => {
        document.body.removeAttribute("show-output");
    });
})();

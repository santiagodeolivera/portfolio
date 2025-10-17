(() => {
    class HttpRequest {
        constructor(url, headers, body) {
            const obj = { url, headers, body };
            Object.assign(this, obj);
        }
    }

    class ParseHttpRequestError extends Error {}
    const parseHttpRequest = (() => {
        const startLineRE = /^([^ ]+) ([^ ]+) HTTP\/([^ ]+)$/;
        const headerRE = /^([^ ]+): ?(.*)$/;

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

            for (const line of lines) {
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
            const lines = txt.replace("\r", "").split("\n")[Symbol.iterator];
            
            const startLine = processStartLine(lines.next().value);

            const headers = processHeaders(lines);

            // TODO
            throw new Error("Not implemented");
        };
    })();
})();
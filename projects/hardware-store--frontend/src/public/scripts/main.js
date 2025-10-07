(() => {
	const notifTypeRegExp = /^[a-zA-Z0-9-_]+$/;
	function verifyNotifData(notifData) {
		if (typeof notifData !== "object") {
			throw new Error();
		}
		
		const { txt, type } = notifData;
		
		if (typeof txt !== "string") {
			throw new Error();
		}
		
		if (typeof type !== "string") {
			throw new Error();
		}
		
		if (!notifTypeRegExp.test(type)) {
			throw new Error();
		}
	}
	
	function newNotif(notifData) {
		verifyNotifData(notifData);
		
		const { txt, type } = notifData;
		
		const div = document.createElement("div");
		div.classList.add("notif");
		div.classList.add(`type-${type}`);
		
		const txtSpan = document.createElement("span");
		txtSpan.classList.add("-txt");
		txtSpan.textContent = txt;
		
		const closeBtn = document.createElement("div");
		closeBtn.classList.add("-close-btn");
		closeBtn.addEventListener("click", () => {
			div.remove();
		});
		
		div.append(txtSpan);
		div.append(closeBtn);
		
		return div;
	}
	
	class NotifDeploymentSystem {
		constructor(mainEl) {
			this.mainEl = mainEl;
		}
		
		addNotif(notifData) {
			const notif = newNotif(notifData);
			this.mainEl.appendChild(notif);
		}
	}
	
	window.notifDeploymentSystems = {};
	for (const div of document.querySelectorAll("div.notif-deployment-system")) {
		window.notifDeploymentSystems[div.id] = new NotifDeploymentSystem(div);
	}
})();

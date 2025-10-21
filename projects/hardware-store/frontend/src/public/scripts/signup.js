(() => {
	const { System } = (() => {
		const loginDiv = document.getElementById("c44a7de8-d3a3-4c76-bfe3-688ea491780d-login-card");
		const usernameInput = document.getElementById("6b8bcc29-34b9-4fbc-950b-553956d24127-text");
		const passwordInput = document.getElementById("66fb6892-860e-4a8d-9938-bcd2d58f30e4-password");
		const submitBtn = document.getElementById("2746d028-c48f-452a-ae60-0871c1a6f764-submit");
		
		const notifDeploymentSystem = window.notifDeploymentSystems["624bd2f5-bf29-47a5-a38d-1e688e26c751-notif"];
		
		class Availability {
			constructor() {
				this.available = true;
			}
			
			get value() {
				return this.available;
			}
			
			set value(v) {
				if (v) {
					loginDiv.classList.remove("processing");
				} else {
					loginDiv.classList.add("processing");
				}
			}
		}
		
		class System {
			constructor() {
				this.availability = new Availability();
			}
			
			async processData() {
				if (!this.availability.value) {
					return;
				}
				
				const username = usernameInput.value;
				const _password = passwordInput.value;
				
				this.availability.value = false;
				
				window.setTimeout(async () => {
					const reqBody = JSON.stringify({username, password: _password});
					const response = await fetchFromBackend("/signup", { method: "POST", body: reqBody });

					if (response.status >= 400 && response.status < 600) {
						const msg = await response.text();
						notifDeploymentSystem.addNotif(msg);
					} else if (response.status === 201) {
						notifDeploymentSystem.addNotif("Success!");
					}

					this.availability.value = true;
				}, 1000);
			}
			
			addClickListener(fn) {
				submitBtn.addEventListener("click", fn);
			}
		}
		
		return { System };
	})();
	
	const system = new System();
	system.addClickListener(() => system.processData());
})();

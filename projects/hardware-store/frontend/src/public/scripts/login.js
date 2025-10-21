(() => {
	const { System } = (() => {
		const loginDiv = document.getElementById("e9aec770-a0db-4a59-87c9-6bef65078891-login-card");
		const usernameInput = document.getElementById("0685f8e3-08a6-44bd-8112-4cb6b233bce5-text");
		const passwordInput = document.getElementById("9935842e-963c-4bb2-97e6-9b81c023ef01-password");
		const submitBtn = document.getElementById("72932964-c85e-4994-8361-dbb27c2d4749-submit");
		
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
				
				const reqBody = JSON.stringify({username, password: _password});
				const response = await fetchFromBackend("/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json; charset=utf-8"
					},
					body: reqBody
				});

				if (response.status >= 400 && response.status < 600) {
					const msg = await response.text();
					notifDeploymentSystem.addNotif({txt: msg, type: "error"});
				} else if (response.status === 200) {
					notifDeploymentSystem.addNotif({txt: "Success!", type: "success"});
				}

				this.availability.value = true;
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

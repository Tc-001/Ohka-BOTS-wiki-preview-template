import {privateUser} from "./newUser"

privateUser.get().then(x => {
  if (x.name == "BlackSrarz") {
    window.theme.toggle = () => alert("Error setting light theme, please contact Tc001")
    window.theme.set(1)
  }
})
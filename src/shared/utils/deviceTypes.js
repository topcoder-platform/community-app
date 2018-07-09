/**
 * Provides lookup data for countryies.
 */
// Desktop, Laptop, Tablet, Smartphone, Console
const deviceTypes = [{name: "Desktop"},{name: "Laptop"},{name: "Tablet"}, {name: "Smartphone"}, {name: "Console"}];


// Basic, Intermediate, Advanced, Native
export function getDeviceTypes() {
  return deviceTypes;
}


export function parseScript(script: string) {

	const gs = (k:string) => {
		let result = script.split(";").find(x => x.trim().startsWith(k+","))?.split(",")[1]
		return result ?? "UNDEFINED"
	}

	let stats = [
		["HP", gs("hpp")],
		["Attack (Basic)", [gs("attmin"), gs("attmax")]],
		["Attack (Trans)", [gs("atttransmin"), gs("atttransmax")]],
		["Evade", gs("evade")],
		["Critical", gs("crit")],
		["Special Transformation", gs("spectrans")],
		["Transformation Gauge", gs("transgauge")],
		["Speed", gs("speed")],
		["Trans Bot Attack", gs("transbotatt")],
		["Trans Bot Def", gs("transbotdef")],
		["Ranged Attack", gs("rangeatt")],
		["Trans Speed", gs("transspeed")],
		["Luck", gs("luk")]
	]

	stats = stats.filter(x => ! x.join().includes("UNDEFINED") )

	return stats

}
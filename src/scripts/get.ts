
interface top {
	name: string
	exp: number
	level: number
	prestige: number
	totalxp: number
}

interface getFunc {
	o?: number
	g?: string
}

interface iget {
	top: {
		user: {
			exp: {get: (params: getFunc) => Promise<top[]>}
			oc: {get: (params: getFunc) => Promise<top[]>}
		}
		guild: {
			gp: {get: () => Promise<{
				Guildname: string
				leader: string
				total_points: number
				number: number
			}[]>}
			power: {get: () => Promise<{
				Guildname: string
				leader: string
				total_points: number
				number: number
				power: number
			}[]>}
		}
	}

	drops: {
		all: {get: () => Promise<{
			name: string
			script: string
			description: string
			part: number  
			bot: number  
			id: number 
			maps: string 		
		}[]>}

		per: {
			get: (params: getFunc) => Promise<{
				name: string
				script: string
				description: string
				type: number  
				bot: number  
				id: number 
				chancecalc: number
			}[]>
		}
	}

	arsenal: {
		equip: {get: (params: getFunc) => Promise<Record<string, string>>},
		main: { get: (params: getFunc) => Promise<{
			name: string,
			bot: string,
			guild: string,
			guildleader: string
		}[]>}
		stats: { get: (params: getFunc) => Promise<{
			level: number 
			prestige: number 
			exp: number 
			totalxp: number
			dogxp: number
			dogmxp: number
			doglevel: number
			equippedemblem: number
			totalenemykills: number
      custom_text: string
			custom_banner: string
      discord: number
		}[]>}
		emblems: { get: (params: getFunc) => Promise<{emblemid: number}[]>}
	}

	item: {
		stats: { get: (params: getFunc) => Promise<{
			name: string
			id: number
			script: string 
			description: string
			part: number
			bot: number
			legendary: number
		}>}
	}

	market: {
		list: {get: () => Promise<{
			gc: number,
			cc: number,
			offers: number
			name: string
			part: number
			bot: number
			legendary: number
			itemid: number
		}>}
		offers: {get: (params: getFunc) => Promise<{
			seller: string
			coinprice: number
			gigaprice: number
			id: number
			duration: number
      sold: number
		}>}
		history: {get: Promise<{
			coinprice: number
			gigaprice: number
			completedate: number
		}>}
	}

	emblems: {
		list: {
			get: (params: getFunc) => Promise<{
				name: string
				descr: string
				id: number
			}[]>
		}
	}
}


function generateGet(currentPath: string = "") {
	return new Proxy({}, {
		get(_, name) {
			if(name=="get"){
				return function(params = {}) {
					return fetch("https://ohkaspace.com/ohkabots/api/v2/get/"+currentPath+".js?"+(new URLSearchParams({g:"", o:0, ...params})).toString())
						.then(x => x.json())
				}
			}
			return generateGet((currentPath&&currentPath+".")+name.toString());
		}
	})
}

export default generateGet() as iget
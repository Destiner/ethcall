export interface Multicall {
	address: string;
	// The block at which the contract was deployed
	block: number;
}

export function getMulticall(chainId: number): Multicall {
	const addressMap: Record<number, Multicall> = {
		1: {
			address: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
			block: 7929876,
		},
		3: {
			address: '0x53c43764255c17bd724f74c4ef150724ac50a3ed',
			block: 7980811,
		},
		4: {
			address: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
			block: 4534725,
		},
		5: {
			address: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
			block: 743550,
		},
		10: {
			address: '0xe295ad71242373c37c5fda7b57f26f9ea1088afe',
			block: 0,
		},
		42: {
			address: '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a',
			block: 11482433,
		},
		56: {
			address: '0xe21a5b299756ee452a6a871ff29852862fc99be9',
			block: 0,
		},
		100: {
			address: '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a',
			block: 0,
		},
		108: {
			address: '0xfce4609743e17d349b7e5f478a7a9a6cfa3c808c',
			block: 0,
		},
		128: {
			address: '0x56171094a15b8cac4314c0f8930100b939503bd9',
			block: 0,
		},
		137: {
			address: '0x35e4aa226ce52e1e59e5e5ec24766007bcbe2e7d',
			block: 0,
		},
		250: {
			address: '0xc04d660976c923ddba750341fe5923e47900cf24',
			block: 0,
		},
		321: {
			address: '0x543528e13eac69206e87334cca971503a552438b',
			block: 0,
		},
		820: {
			address: '0x8ba3d23241c7044be703afaf2a728fdbc16f5f6f',
			block: 0,
		},
		1337: {
			address: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
			block: 0,
		},
		4689: {
			address: '0x0e14ded9e7965c6446df2e5c528dd1b4e3b4640f',
			block: 0,
		},
		42161: {
			address: '0x10126ceb60954bc35049f24e819a380c505f8a0f',
			block: 0,
		},
		43114: {
			address: '0xE8eeDd99baC03871CF123E76cE90bA179Df94351',
			block: 0,
		},
		80001: {
			address: '0x08411add0b5aa8ee47563b146743c13b3556c9cc',
			block: 0,
		},
		1313161554: {
			address: '0xa48c67d1c60b8187ecb7c549e8a670419d356994',
			block: 0,
		},
		1666600000: {
			address: '0xfe4980f62d708c2a84d3929859ea226340759320',
			block: 0,
		},
	};
	return addressMap[chainId];
}

export function getMulticall2(chainId: number): Multicall {
	const addressMap: Record<number, Multicall> = {
		1: {
			address: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
			block: 12336033,
		},
		4: {
			address: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
			block: 8283206,
		},
		5: {
			address: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
			block: 4489716,
		},
		42: {
			address: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
			block: 24025820,
		},
		56: {
			address: '0x4c6bb7c24b6f3dfdfb548e54b7c5ea4cb52a0069',
			block: 0,
		},
		100: {
			address: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
			block: 0,
		},
		137: {
			address: '0xf43a7be1b284aa908cdfed8b3e286961956b4d2c',
			block: 0,
		},
	};
	return addressMap[chainId];
}

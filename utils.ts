export const randomWords = [
	"apple",
	"brave",
	"crane",
	"dodge",
	"eagle",
	"faint",
	"gamer",
	"honey",
	"ideal",
	"joker",
	"lemon",
	"mango",
	"night",
	"ocean",
	"peace",
	"quake",
	"river",
	"spark",
	"tiger",
	"unity",
];

export const getRandomWord = () => {
	const idx = Math.floor(Math.random() * randomWords.length);
	return randomWords[idx];
};
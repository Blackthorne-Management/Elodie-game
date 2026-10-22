// Lore books (guide 6.6: every capital has a library, and its capital building has books too). A shelf
// is a puzzle object whose dialogue lists its books; reading one sets `lore.<book id>` (read later by
// Influence, Gianna's spells and the debates' Reason appeal). Each book is 100 to 150 words, cut into
// dialogue pages of at most 128 characters at sentence ends (tests/books.test.ts checks both).
// Story facts follow docs/quest/QUEST-BUILD-GUIDE.md Section 5; the Seventh Clause and Rael's secret
// are only hinted at.

import type { Condition } from '../engine/conditions.ts';
import type { DialogueChoice, DialogueScript, Speaker } from '../engine/dialogue.ts';
import type { ObjectInfo } from '../engine/content.ts';

export type BookCategory = 'history' | 'law' | 'religion' | 'trade' | 'war' | 'gossip' | 'folklore' | 'genealogy';

export interface Book {
  id: string;
  title: string;
  category: BookCategory;
  /** The text; split into pages by `bookPages`. */
  text: string;
  /** On its shelf only once this holds (a book returned by a side quest). */
  available?: Condition;
}

export interface Shelf {
  /** The puzzle object id on the map. */
  id: string;
  /** The name label shown when facing it. */
  name: string;
  books: readonly string[];
}

export const MAX_PAGE_CHARS = 128;

export const BOOKS: readonly Book[] = [
  // ---- Zetwal: the Temple Archive ----------------------------------------------------------------
  {
    id: 'zetwal_founding',
    title: 'The Founding of Zetwal',
    category: 'history',
    text:
      'Before the Accord, before the Marshal, the island belonged to the Aldermoor Crown, and so did the people who cut its cane. ' +
      'Crown law called them property. The temple called them names, and wrote every one of them down. ' +
      'Mother Solange Jean-Philippe kept that list. She was a high priestess with a sun mark at her temple, and she taught that the goddess Elodie remembers what kings forget. ' +
      'When the Crown burned the first archive, Solange rebuilt it here, across the chasm. Soldiers would have to cross a bridge to reach it. ' +
      'She did not live to see the island free. Her line did. The list is still here, on the lowest shelf, in her hand.',
  },
  {
    id: 'zetwal_alliance_war',
    title: 'The Alliance War',
    category: 'war',
    text:
      'Fifty years ago Zetwal rose, and the Crown expected to crush it in a season. It did not count on allies. ' +
      'Marshal Patricio Jean-Philippe commanded the joint armies. Lord Benny of Ardencia brought House Brasador across the sea, and no one has ever fully explained why. ' +
      "Caona of Xaraguá led the scouts who found every Crown road. Lady Sayo Suzumori's whisperers sent word of each troop movement before the troops moved. " +
      'On the last night the Marshal and Lord Benny sealed their alliance with a token in two halves. A sun locket for Zetwal, a signet for Ardencia. ' +
      'The next morning the Sun Accord was signed in the plaza, and the Crown sailed home.',
  },
  {
    id: 'zetwal_ash_wars_temple',
    title: 'Ash Wars: A Temple Record',
    category: 'history',
    text:
      'Twenty-five years ago Crown raiders and rival lords burned the highland roads. Lord Rael of Ardencia marched his grand army against them. ' +
      'The songs call him Rael the Ruthless. This archive sent healers with every column, as the Gaze requires, and they wrote what they saw. ' +
      'At the ford of Cendre, the Crown chronicle counts four hundred prisoners put to the sword. Our healers counted forty dead, all fallen in the fighting, and three hundred prisoners sent home. ' +
      'The chronicle was written in Aldermoor. Our record was written at the ford. ' +
      'The keeper of that year added one line in the margin: "Someone wants him feared. I do not know if it is the Crown, or him."',
  },
  {
    id: 'zetwal_gaze_primer',
    title: 'The Gaze of Elodie',
    category: 'religion',
    text:
      'The goddess Elodie wove the realm, and she remembers every thread of it. She does not rule. She does not punish. She sees. ' +
      'That is the whole of the faith, and it is harder than it sounds. A ruler who knows she is seen must answer for what she does, even when no court will make her. ' +
      'So the faithful keep libraries, because memory is the goddess at work. They remember their dead aloud. ' +
      'Some children are born with a faint sun mark on the temple or the cheek. The old families say it shows the goddess looked twice. ' +
      'Kay Soley heirs carry it. The archivists are taught never to treat it as a crown.',
  },
  {
    id: 'zetwal_blessed_seat',
    title: 'The Blessed Seat',
    category: 'religion',
    text:
      'Before there were houses, there was the Gaze. Ours is the oldest faith in the realm, and no scholar of any house disputes it. ' +
      'When the first heirs came to the old seat where the eight roads meet, the temples teach that Elodie came with them. ' +
      'She did not sit. She does not rule. She blessed the seat, and set her sun on the brow of those who would keep it honest. ' +
      'That is why the faithful still call the city Elodie\'s Seat, whatever the maps say. The sun mark is her sign. ' +
      'The kings of Aldermoor have struck this page from their copies three times. Each time, this archive copied it again. ' +
      'A margin note in a careful hand: "Ask the Crown why it fears a story it calls false."',
  },
  {
    id: 'zetwal_say_their_names',
    title: 'Why We Say Their Names',
    category: 'religion',
    text:
      'At the Festival of the Gaze, the people of Zetwal stand in the plaza and say the names of their dead aloud. One family after another, until the sun sets. ' +
      'Visitors find it long. The faithful find it short. ' +
      'The custom began in the years of the Crown. The dead were buried without stones, and their names were struck from the ledgers. ' +
      'Saying a name aloud was a small rebellion. If the goddess remembers, and the people remember, no ledger can make a person vanish. ' +
      'The name stones on the temple island were cut after the war. Every one of them was carved from a name someone refused to forget.',
  },
  {
    id: 'zetwal_four_hands',
    title: 'The Four Hands',
    category: 'religion',
    text:
      'The people of Xaraguá keep a different faith, and this archive keeps their account of it with respect. ' +
      'They hold that land, water, wind and fire are four living hands, and that no one owns what a hand holds. ' +
      'Offerings are left at springs, groves, mountain passes and hearth flames. The areito, their dance of memory, carries history from the old to the young. ' +
      'In Xaraguá the Roots and Tides keep the earth and the sea. Far away, the Sky-Riders of Skarragol and the Flame Keepers of Jwaladesh honor the other hands. ' +
      'Their elders ask one question of every treaty: who gave you the right to sell what the hands were holding?',
  },
  {
    id: 'zetwal_bridge_tale',
    title: 'The Bridge With Two Ends',
    category: 'folklore',
    text:
      'Children on the plaza tell it this way. On the night before the Accord, the temple island was cut off: the Crown had raised the Chain Bridge and broken its winch. ' +
      'A young soldier lowered it by hand, alone, and drove an iron pin through the pawl so it could never rise again. Then he walked away and nobody saw his face. ' +
      'Some say it was the Marshal. Some say it was a ghost from a time that had not happened yet. ' +
      'The old ferryman says only that the pin was too clean, as if someone had polished it fifty years before it was needed. ' +
      'Archivists are asked to record the story and not to argue with it.',
  },
  {
    id: 'zetwal_hutia_lamp',
    title: 'The Hutia and the Lamp',
    category: 'folklore',
    text:
      'A fable told on both shores. A hutia, the round-eared little thief of the islands, wanted the brightest thing in the world. ' +
      'It stole a coin, a shell, a fish scale and a star reflected in a puddle. None of them was bright enough. ' +
      'At last it crept into the temple and tried to steal the light of the Gaze Lamp itself. ' +
      'The light would not be carried. It only grew brighter the closer the hutia came. At last the little thief sat down in the glow and forgot what it had come to take. ' +
      'The keepers say the lamp still lights itself for anyone who sits close enough and wants nothing from it.',
  },
  {
    id: 'zetwal_overdue',
    title: 'Archive Ledger: Overdue',
    category: 'gossip',
    text:
      'Junior archivist G. Limyè, notes for the keeper. Overdue books, in order of shame. ' +
      'The ferryman: "Tides of the Southern Reach." Six months. He says the sea has it now. ' +
      'The soup vendor: "Ninety Ways With Pumpkin." Returned with soup on page forty. Fined in soup. ' +
      'Grandmother Anicette: "Ash Wars Gossip, Volume Two." Overdue three years. ' +
      'Do not ask her for it. When I asked, she asked me why I wanted to know about the Lord of Ardencia, and then she changed the subject to my posture. ' +
      'Volume One is missing from the shelf as well. Nobody has signed it out.',
  },
  {
    // Returned by the side quest The Overdue Shelf: one of the four Ash Wars accounts (Anicette's).
    id: 'zetwal_ash_wars_anicette',
    title: 'Ash Wars Gossip, Volume Two',
    category: 'gossip',
    available: { flag: 'side.overdue.done' },
    text:
      'A gossip\'s history of the Ash Wars, printed in Aldermoor, full of Lord Rael\'s cruelties. Every margin is filled in Grandmother Anicette\'s hand. ' +
      'Beside the burning at Cendre: "Forty, not four hundred. The healers counted. Gossips do not." ' +
      'Beside the tale of Rael hanging his captains: "One captain. For selling the grain meant for the hungry. Nobody prints that part." ' +
      'Beside a woodcut of Rael with horns: "Better looking than this. Sadder, too." ' +
      'On the last page, a longer note. "Patricio met him once, after the war. He came home and said the man wears his name like armour. ' +
      'He did not know what Rael keeps under it. Neither do I. ' +
      'Elodie came home from the highlands that spring and would not speak of it at all."',
  },

  // ---- Zetwal: the Hall of the Accord (the seat of the Zetwal state) -----------------------------
  {
    id: 'zetwal_sun_accord',
    title: 'The Sun Accord (copy)',
    category: 'law',
    text:
      'A fair copy of the Sun Accord, kept for any citizen who asks. ' +
      'One: Zetwal is free, and no crown shall rule it. Two: Ardencia, Xaraguá and the allied houses are its friends in peace as in war. ' +
      'Three: the Crown withdraws every soldier within one season. Four: prisoners return home on both sides. ' +
      'Five: trade through Zetwal pays no tribute to Aldermoor. Six: the Throne at Elodie\'s Seat shall hear any house that claims a breach. ' +
      'The clerk who copied it left a note under the last line. The signed original is bound with seven silk ribbons, one for each clause. ' +
      'He could only find six clauses to copy.',
  },
  {
    id: 'zetwal_crown_chronicle',
    title: 'The Throne: A Crown Chronicle',
    category: 'law',
    text:
      'Copied from the Aldermoor chronicles for the Hall of the Accord, by order of the Regent\'s office. ' +
      'The Throne at Eightgate was raised by the first kings, in stone and timber, with the consent of the houses. ' +
      'Eight roads were cut to its eight gates, so that no house could say it was kept out. ' +
      'No goddess attended. The chronicles of that year record the weather, the wages and the price of stone, and nothing else. ' +
      'Certain temples teach that Elodie blessed the seat and marked its heirs with her sun. This is a pious tale. ' +
      'To repeat it as law sets one faith above the consent of all, and that is close to sedition. ' +
      'Below, someone has scratched: "Then why burn the archive that kept the older record?"',
  },
  {
    id: 'zetwal_eight_houses',
    title: 'The Eight Houses',
    category: 'genealogy',
    text:
      'Eight houses hold the lands of the realm. Kay Soley in Zetwal, keepers of the sun. Brasador in Ardencia, the highland lords. ' +
      'Yaguana in Xaraguá, the people of the coast and the cacique line. Dorini in Al-Doria, the merchant ledger-keepers. ' +
      'Ironvow in Skarragol, the riders of the steppe. Suzumori in Kuroshi, the fog city of whispers. Agnivansh in Jwaladesh, the flame-sworn. ' +
      'And Stillwater in Aldermoor, the house of the Crown. ' +
      'The Throne stands at Elodie\'s Seat. By old law, any family that has headed a state may claim it. That is why the old families marry carefully, and some of them in secret.',
  },
  {
    id: 'zetwal_harbor_tolls',
    title: 'Harbor Tolls and Roads',
    category: 'trade',
    text:
      'Notes of the harbor master, for merchants arriving in Zetwal. Cane, coffee and indigo leave by the south harbor; salt, iron and cloth come in. ' +
      'Since the Accord, no ship pays tribute to Aldermoor here, and the Crown has never forgiven it. ' +
      'The Carriage Guild under Papa Wout runs carriages and ferries to the other capitals. He knows every road and sells a rumor with every ticket. ' +
      'The Cane Road beyond the east gate has been peaceful since the war. The old cutters still tell stories of bandits in the fields. Lately a few people in grey veils walk it, asking the young if they are lonely. ' +
      'Travel in company. Travel by day.',
  },
  {
    id: 'zetwal_quiet_tract',
    title: 'A Quiet Crown Tract',
    category: 'religion',
    text:
      'Seized in the plaza by the town guard. Kept here as evidence. ' +
      'Are you tired? Tired of drums and shouting, of houses arguing, of a thousand voices and no answer? ' +
      'The realm is sick with noise. The Quiet Crown offers rest: bread for the hungry, help with your debts, a place where no one asks you to shout your grief. ' +
      'We ask only that you listen. One voice instead of a thousand. One hand on the Throne. ' +
      'When the Quiet comes, you will not have to choose anymore. ' +
      'Below, in pencil, the guard captain wrote: "Bread that asks nothing back. Debts paid by strangers. Ask who holds the debt now."',
  },
  // ---- Xaraguá: the Song House (accounts set down from the areíto's songs) --------------------------
  {
    id: 'xaragua_song_guanin',
    title: 'The Song of Guanín',
    category: 'history',
    text:
      'The song begins in the dark, with paddles. Guanín led nine canoes across open water, steering by the stars and by the birds. ' +
      'When the birds turned for land, the people turned with them, and found a green island with a harbor shaped like a cupped hand. ' +
      'Guanín climbed the mountain and looked down at the bay. "We will not own this," he said. "We will keep it, and it will keep us." ' +
      'So they planted cassava, built round houses facing the sea, and cleared a dance ground where every story could be sung again. ' +
      'The singers say the song has no last verse. Each cacique adds one. Anaco has not yet added his.',
  },
  {
    id: 'xaragua_caona_road',
    title: "Caona's Road",
    category: 'war',
    text:
      'Fifty years ago the Crown marched inland to cut Zetwal from its allies, and Caona, daughter of the cacique, went to meet them. ' +
      'She did not fight them. She watched them. Her scouts lay in the ferns for days and counted boots, carts and cannon. ' +
      'Every road the Crown built, Caona found. Every river it forded, she had forded first, and left the bank a little softer. ' +
      'Her runners carried the counts to Marshal Patricio across the strait. He used to say the war was won by people the Crown never saw. ' +
      'When the war ended, Caona came home and danced the areíto for three nights. She never spoke of the fourth.',
  },
  {
    id: 'xaragua_first_oath',
    title: 'The First Oath',
    category: 'law',
    text:
      'Before the Accord was written, it was sworn. Three young people stood on the stones of the areíto in Yucayeque. ' +
      'Caona of Xaraguá, Patricio of Zetwal and Benny of Ardencia each put a hand on the oldest stone, the one with the open eyes. ' +
      'Caona spoke first, so her words are the ones the singers keep: "The harbor stays with the people who fish it." ' +
      'The others answered for their own lands, and the drums kept the count so no one could add a word later. ' +
      'The keepers say the oath was carved into the petroglyph cave the same night, where the water rises. No one has read it since.',
  },
  {
    id: 'xaragua_roots_tides',
    title: 'The Roots and Tides',
    category: 'religion',
    text:
      'In Xaraguá the Four Hands are honored at the springs and on the shore, not in a temple. ' +
      'Offerings of cassava and flowers go into the water at dawn. The tide takes them, and the people say the tide answers. ' +
      'The Roots and Tides teach that land and sea cannot be sold, because they were never given. They were lent, to be kept. ' +
      'A keeper of the springs once told a Gaze pilgrim: "Your goddess remembers. Ours forgives. Between them, the island gets by." ' +
      'Visitors are welcome at the springs. They are asked only to leave as quietly as they came, and to take nothing but water.',
  },
  {
    id: 'xaragua_opia',
    title: 'What the Opía Remember',
    category: 'folklore',
    text:
      'The Yaguana speak of their dead as near, not gone. The opía walk the island at night and rest by day, and they are family. ' +
      'Children are told that an opía has no navel, so you will always know one, and that they mean no harm. ' +
      'Food is left out on the night of a remembering, and the house is swept so that visitors find their way. ' +
      'The singers say the opía keep the memory of every promise made on the island, and grow restless when one is broken. ' +
      'This account was set down with the keepers\' permission. They ask that it be read with care, and not told as a ghost story.',
  },
  {
    id: 'xaragua_cassava_salt',
    title: 'Cassava and Salt',
    category: 'trade',
    text:
      'Xaraguá fed itself long before the Crown came to tax it. Cassava grew in mounds on every hillside and kept for a year. ' +
      'Grated, pressed and baked on a griddle, it became casabe, the flat bread that sailors carried across the strait. ' +
      'Salt came from the pans on the beach, dried by the sun and raked by the children for a handful of beads. ' +
      'Casabe and salt bought tools from Zetwal, cloth from Al-Doria and, once, a horse from Skarragol that nobody could ride. ' +
      'Since the customs house opened, every basket is counted and stamped. The bakers say the bread tastes the same. The price does not.',
  },
  {
    id: 'xaragua_charter',
    title: 'The Charter (seized copy)',
    category: 'law',
    text:
      'A copy of the Crown\'s paper, taken from a marine\'s satchel and set down word for word by the keepers. ' +
      'It offers Xaraguá "the protection of His Majesty\'s fleet, in perpetuity, against all enemies foreign and domestic." ' +
      'In return the harbor, its fisheries and its salt pass "into the keeping of the Crown\'s Governor, as lawfully provided." ' +
      'Lawfully provided by what, the keepers asked. The paper answers only: "under the seventh clause of the Accord, as signed." ' +
      'No one in Yucayeque remembers a seventh clause. The singers have searched every verse of the oath. It is not there. ' +
      'The marine wants his satchel back.',
  },
  {
    id: 'xaragua_hutia',
    title: 'Why the Hutia Steals',
    category: 'folklore',
    text:
      'Once the hutia looked up at the night and fell in love with the stars. It wanted one for its burrow. ' +
      'It climbed the ceiba, but the stars were higher. It climbed the mountain, but they were higher still. ' +
      'So the hutia went down to the village, where people kept small shining things: beads, shells, a polished bone. ' +
      '"These are stars that have fallen," it decided, and carried them home, one by one, while everyone slept. ' +
      'Its burrow became the brightest in the forest. The hutia was very proud. ' +
      'The people did not mind much. Now, when a bead goes missing, they say the sky has been visiting.',
  },
  {
    id: 'xaragua_caciques',
    title: 'The Line of the Caciques',
    category: 'genealogy',
    text:
      'Guanín, who brought the canoes and cleared the dance ground, and would not own the land he kept. ' +
      'Caona, his daughter, who counted the Crown\'s boots in the Revolution and swore the first oath on the open-eyed stone. ' +
      'Anaco, her son, cacique in the long peace, who wrote to the Throne when the Crown ships came back and was never answered. ' +
      'Yari, his daughter, hunter and runner, who knows every path on the mountain and argues with every elder on the council. ' +
      'Beside each name the keepers mark the generation\'s song, so it can be sung in order at the areíto. ' +
      'Yari\'s space is still empty. The keepers say she is not finished.',
  },
  // ---- Xaraguá: the Caney of Anaco (the cacique's records) ----------------------------------------
  {
    id: 'xaragua_council_minutes',
    title: "The Council's Minutes",
    category: 'law',
    text:
      'The runners\' record of the elders\' council, the night the Charter was read aloud. ' +
      'The elder for the Charter: "The Crown has ships. We have canoes. Peace with a price is still peace." ' +
      'The elder against: "We swore an oath on the stones. A paper does not unswear it." ' +
      'The third elder asked for the vote to wait for the cacique, and the council agreed, though not all of it gladly. ' +
      'At the end, a note in a smaller hand: the vote stands two short of accepting. ' +
      'Below it, in charcoal, someone else has written: "Two is not many. Watch the liaison officer."',
  },
  {
    id: 'xaragua_anaco_letter',
    title: "Anaco's Letter to the Throne",
    category: 'history',
    text:
      'A copy kept by the head runner, of the letter Cacique Anaco sent to Eightgate when the Crown ships returned. ' +
      '"To the Throne of the realm, from the keeper of Xaraguá. Three warships sit in our harbor. Their Governor says the Accord allows it." ' +
      '"We signed that Accord with our blood and our scouts. We do not remember giving our harbor away. Was it given in our name?" ' +
      '"I ask for an answer before my council is asked to answer for me." ' +
      'The runner\'s note: sent with the fastest canoe, by way of Pòdlimyè. Copy kept. No answer has come.',
  },
  {
    id: 'xaragua_healer_notes',
    title: "A Healer's Notes",
    category: 'history',
    text:
      'The behique\'s notes on the cacique\'s fever, kept on bark strips in a cotton bag. ' +
      'Day one: heat in the head, weakness in the hands. Gave the usual leaves. He sent them back to the cooks. ' +
      'Day nine: the fever comes and goes with the tide. Not the usual fever. Not any fever I have seen. ' +
      'The old cure is a bark from the grove above the cave, where Caona\'s scouts used to camp. The grove has not been found in years. ' +
      'Day fourteen: he asked for his daughter and for the council\'s vote, in that order. Told him neither was here yet.',
  },
  {
    id: 'xaragua_customs_receipts',
    title: 'Customs Receipts',
    category: 'trade',
    text:
      'A bundle of the Crown\'s receipts, copied by the runners who carry the village\'s goods past the customs house. ' +
      'Snapper, forty baskets: one in five to the Crown. Salt, twelve sacks: one in four. Casabe, sixty rounds: one in five. ' +
      'Cotton, by the bolt: one in three, "as the Governor shall determine." The Governor determines often. ' +
      'Among the receipts is one strange line, in the clerk\'s neatest hand: "Lamp oil, eight jars, unknown sender. Fee waived." ' +
      'Nothing else in the bundle is ever waived. The runner has circled it twice. ' +
      'Beside the circle, a question in the runner\'s own hand: who can make the Governor waive anything?',
  },
  // ---- Ardencia: La Biblioteca Vieja and the Alcázar (Chapter 3) ----------------------------------
  {
    id: 'ardencia_brasador_count',
    title: 'Ash Wars: The Brasador Count',
    category: 'war',
    text:
      'Ardencia keeps its own count of the Ash Wars, and it does not sing. ' +
      'Raiders burned the highland roads for three summers. The Crown sent letters. Lord Rael sent the grand army. ' +
      'The count lists every column, every ford and every grave, and the name of the man who dug it. ' +
      'It lists the prisoners too, by the hundred, and beside each hundred one word: released. ' +
      'The songs in the taverns say otherwise. They say the ford ran red and the Lord laughed. ' +
      'The clerk who copied this count has added a line at the bottom: "The Lord has read the songs. He has never ordered one stopped." ' +
      'Nobody in Cenizal has ever explained why.',
  },
  {
    id: 'ardencia_cendre',
    title: 'The Ford of Cendre',
    category: 'history',
    text:
      'Cendre is a ford on the highland road, a day north of Cenizal. Twenty-five years ago the Ash Wars ended there. ' +
      'Lord Rael held the far bank with four hundred men. Beside him stood a young captain of the guard named Rivera. ' +
      'The raiders came at dawn with Crown powder in their wagons, which the Crown has never explained either. ' +
      'The fight lasted an hour. Rivera took a blade meant for the Lord and kept standing. ' +
      'When it was over the Lord walked into the river to his knees and stood there until noon. ' +
      'The soldiers say he was counting. The Crown chronicle says he was gloating. ' +
      'Captain Rivera has never said, and he is the only one who would know.',
  },
  {
    id: 'ardencia_oaths',
    title: 'Oaths of the Ash Road',
    category: 'law',
    text:
      'Every soldier of Ardencia swears the same oath on the same iron, in the duel court, before the elders. ' +
      'Stand for the house. Do not steal from the house. Do not break the law of the blade. ' +
      'The Witnesses, who keep the soldiers\' faith, teach that an oath binds the one who swears it, and no one else. ' +
      'A soldier who steals has broken his oath. A hungry child who steals has sworn nothing, and has broken nothing. ' +
      'The elders call this teaching dangerous. The Witnesses call it arithmetic. ' +
      'The law says the oath-breaker answers to the house. It does not say who answers for a house that lets its people starve.',
  },
  {
    id: 'ardencia_witness',
    title: 'The Witness Among Soldiers',
    category: 'religion',
    text:
      'The Witness is the soldiers\' faith in Ardencia, older than the Accord and younger than the forges. ' +
      'It has no temple. It has the duel court, the barracks and the road. ' +
      'A Witness believes the world keeps a ledger of every promise made in it. ' +
      'Keep the promise, and the ledger balances. Break it, and someone pays, though not always the one who broke it. ' +
      'So a Witness oath-knight carries the cost of other men\'s broken oaths, on purpose, as a kind of prayer. ' +
      'The Gaze of Elodie remembers. The Witness keeps accounts. ' +
      'In Cenizal, people say the difference between them is the difference between a mother and a banker.',
  },
  {
    id: 'ardencia_iron_trade',
    title: 'The Iron Trade',
    category: 'trade',
    text:
      'Ardencia has iron and fire and almost nothing else. Every loaf in Cenizal was paid for in iron somewhere. ' +
      'The Crown buys Brasador steel for its marines, and pays late. Zetwal buys it for its harbor chains, and pays on time. ' +
      'Al-Doria lends against it, and charges for the pleasure. ' +
      'Three years ago the iron ledgers of the Upper Town began to show a small shortfall every month. Never more than a cart. ' +
      'The treasurer of that year reported it. Then the treasurer retired. ' +
      'The shortfall did not. Whoever is taking a cart of the Lord\'s iron every month, the Lower Town has eaten well since.',
  },
  {
    id: 'ardencia_kitchen_maids',
    title: 'What the Kitchen Maids Say',
    category: 'gossip',
    text:
      'Collected, says the cover, by a kitchen maid of the Alcázar who would rather not be named. ' +
      'The Lord eats standing up. The Lord has not laughed since the Ash Wars, except once, at a letter from abroad, which he burned. ' +
      'The old lord Benny takes sugar in his coffee and denies it. The steward counts the spoons. ' +
      'Somebody in the house sends bread to the Lower Town by night, and every maid knows it, and every maid has decided not to know. ' +
      'The young lord Azriel reads in the kitchen because it is warm. ' +
      'He asked the cook once why there are no portraits of his mother. The cook gave him an extra pastry and changed the subject.',
  },
  {
    id: 'ardencia_last_report',
    title: "The Treasurer's Last Report",
    category: 'trade',
    text:
      'An unsigned report, filed eleven years ago, the last in the treasurers\' row. ' +
      'Iron sold to the Crown: four hundred carts. Iron paid for by the Crown: three hundred and ten. ' +
      'The report asks the Lord to press the Crown for the rest. Beside the request, in another hand: Not yet. ' +
      'Below that, the treasurer again: Then when? There is no answer. ' +
      'The last page says the treasurer will retire at the end of the month, by his own wish. ' +
      'The ink of "by his own wish" is darker than the rest, as if someone went over it twice. ' +
      'The report is not signed. Every other report on the shelf is.',
  },
  {
    id: 'ardencia_blade_law',
    title: 'The Law of the Blade',
    category: 'law',
    text:
      'Don Alonso, first Lord of Ardencia, made one law before any other: no outsider is heard who has not stood in the ring. ' +
      'He meant it kindly. A stranger who had faced a Brasador blade and kept her feet had earned the right to speak. ' +
      'The trial is fought on the sand beside the Alcázar, before the elders. The Lord may fight it himself, or send a champion. ' +
      'Lord Benny never sent a champion. Lord Rael never has either. ' +
      'The winner may ask the loser one question, and the loser must answer it, truly, between the blades. ' +
      'No record says what Don Alonso asked. Every record says he never lost.',
  },
  // ---- Al-Doria (Chapter 4): the House of Ledgers' six, and the Majlis's archive of contracts -----------------
  {
    id: 'aldoria_letter_numbers',
    title: 'The Letter-Numbers',
    category: 'trade',
    text:
      'Before the Dorini counted in figures, they counted in letters. Alif was one, ba two, jim three, and so on up the alphabet to a thousand. ' +
      'A guild ledger written in letter-numbers looks like a poem to a stranger and like a price to a clerk. ' +
      'The old counting house used them for every entry that mattered, because a thief who could read could still not count. ' +
      'Kaf is twenty. Ha is five. A careful clerk writes the sum plain in the margin as well, for the day the ink runs. ' +
      'The careless ones trust the ink. The guild has never lost a ledger to fire. It has lost several to damp.',
  },
  {
    id: 'aldoria_dorini_promise',
    title: 'The Dorini Promise',
    category: 'history',
    text:
      'House Dorini was a family of moneychangers before it was a house. Its first promise was written on the door of the first counting house: ' +
      'what is weighed here is weighed true. Every Merchant-Prince since has sworn it on taking the divan. ' +
      'The Dorini witness, the saying goes, and the Dorini hold. A Dorini witness keeps a copy of what was signed. ' +
      'It gives that copy to no one, not even the signers, so nobody can change it afterwards. ' +
      'Fifty years ago the Dorini witnessed the Sun Accord. The ledger of that year is kept with the others, under the guild hall. ' +
      'Merchants say the Promise is the reason Al-Doria has never needed walls as high as Cenizal\'s.',
  },
  {
    id: 'aldoria_on_contracts',
    title: 'On Contracts',
    category: 'law',
    text:
      'A contract binds the ones who sign it, and those who consent through them. It binds no one else. ' +
      'A merchant may sell his own camel; he may not sell his neighbour\'s, however good the price, however fine the seal. ' +
      'The guild\'s courts have held to this for two hundred years. A bargain over a third party\'s goods binds the third party to nothing, ' +
      'and the seller owes the buyer back his money. ' +
      'The Witness priests teach the same: a promise is watched by the one who made it. ' +
      'Every apprentice copies this book in his first month. Most forget it by his first profit.',
  },
  {
    id: 'aldoria_witness_market',
    title: 'The Witness in the Market',
    category: 'religion',
    text:
      'The Witness faith came to the bazaar with the first caravans. Its priests sit beside the contract tables and watch. ' +
      'They do not judge whether a bargain is fair. They judge only whether it was kept. A promise written is a promise watched, they say. ' +
      'The Gaze keepers, who came later, answer that remembering who was cheated is part of watching. ' +
      'The two faiths have argued by the dry fountain for as long as there has been a fountain. ' +
      'Most merchants keep both: the Witness for their contracts, the Gaze for their consciences. On market day, they keep their distance.',
  },
  {
    id: 'aldoria_city_water',
    title: 'The Water of Bab al-Dhahab',
    category: 'history',
    text:
      'The city drinks from a qanat: a tunnel that carries water underground from the hills past the Desert Edge. ' +
      'At the cistern head the flow divides. One line feeds the city\'s fountains; the other, built later, feeds the guild\'s tanks. ' +
      'An iron gate on the old city line can be shut, to clean the channel. The year the guild vault was built, it was found loose. ' +
      'An engineer of the Zetwal army, in the city for the signing, wanted its iron for the march home. Someone stopped him. ' +
      'The record does not say who. The city fountain has run dry twice since: in the great drought, and this year.',
  },
  {
    id: 'aldoria_eight_gates',
    title: 'The Eight Gates',
    category: 'trade',
    text:
      'Eightgate has eight gates, one for each road into the Seat, and every one is watched. ' +
      'Envoys are searched; merchants are taxed; strangers wait. A Dorini caravan alone passes every gate unquestioned. ' +
      'The Crown granted it for the guild\'s loans in the Ash Wars, and has never dared take it back. ' +
      'The caravan master carries the Merchant-Prince\'s pass. Anyone in the caravan is the guild\'s, as far as the gates are concerned. ' +
      'It is the one thing a Dorini pass is good for in Eightgate. It will get you through a gate. It will not get you through a door.',
  },
  {
    id: 'aldoria_vault_register',
    title: 'The Vault Register',
    category: 'history',
    text:
      'Register of the guild vault under the guild hall, kept by the chief scribe. ' +
      'Twelve iron boxes, numbered, in the strongroom behind the balance door. The guild\'s own price opens that door. ' +
      'The guild knows its price. ' +
      'Box seven: sealed, "for the bearer of the sun", by order of Yusuf, keeper of the ledger, fifty years ago. Not opened since. ' +
      'The witness\'s niche, at the far end: the Dorini copy of the Sun Accord. Its lock was cut to a pattern no guildsman holds. ' +
      'Opened by: no one. Remarks: the guild does not hold the key to its own witness. That was the point.',
  },
  {
    id: 'aldoria_crown_preference',
    title: "The Crown's Preference",
    category: 'law',
    text:
      'Agreement between His Majesty\'s trade factor and the Dorini guild council, in the Merchant-Prince\'s Majlis. ' +
      'In return for the guild\'s good offices in the ports, the Crown grants the guild preference in its harbours. ' +
      'Preference means the first purchase of any cargo landed, at a price the Crown names, before any other buyer may bid. ' +
      'Schedule of harbours: Pòdlimyè, Cenizal, and, by the seventh clause of the Sun Accord as signed, Yucayeque in Xaraguá. ' +
      'Signed for the guild by Guildmaster Qasim. Witnessed by the chief scribe. ' +
      'The space for the Merchant-Prince\'s seal is empty. A note in the margin, in a different hand: "Not by me."',
  },
  // ---- Eightgate (Chapter 5): the Throne Hall's records room (four), and the Throne Archive (five of the design's
  // ten for the release: the outline's cut list). The Seventh Clause joins the Hall's shelf once it is read aloud.
  {
    id: 'seat_regent_commission',
    title: "The Regent's Commission",
    category: 'law',
    text:
      'The Commission was sealed by the Crown of Aldermoor in the year after the Accord. ' +
      'It names a Regent to keep the Seat while the Throne stands empty. ' +
      'The Regent holds the Throne for the realm. He does not sit it, and he may not be crowned. ' +
      'He keeps the peace of the eight gates, the Archive and the Hall, and he calls the Parley. ' +
      'The Commission runs until a claimant stands on the Throne tile with the houses behind her. ' +
      'It does not say how many houses. Three Regents have held it. The present one has held it longest. ' +
      'A note in the margin, in a clerk\'s hand: "Renewed. Renewed. Renewed." ' +
      'The last renewal is signed by the Regent himself.',
  },
  {
    id: 'seat_petitions_breach',
    title: 'Petitions of Breach',
    category: 'law',
    text:
      'Under the Founding Compact, a house that believes a treaty broken may petition the Hall in Parley. ' +
      'The petition is carried to every chamber, and every envoy answers it in the record. ' +
      'A petition no one carries is not refused. It is simply never heard. ' +
      'The register lists two hundred and six petitions since the Accord. ' +
      'One hundred and ninety were heard. Fifteen were withdrawn. ' +
      'One, from the cacique\'s house of Yucayeque in Xaraguá, is marked "received" and nothing else. ' +
      'Its date is forty-nine years ago. The space for the chambers\' answers is blank. ' +
      'Someone has drawn a small circle round the blank, in ink that is not old.',
  },
  {
    id: 'seat_council_eight',
    title: 'The Council of Eight',
    category: 'history',
    text:
      'Before the Ash Wars, the realm had a council of eight chairs, one for each house, before the Throne. ' +
      'The houses sat; whoever stood on the Throne tile spoke for all of them, and only while they let her. ' +
      'The council last sat in full in the year the war began. Its chairs have stood empty since. ' +
      'At a Parley the envoys stand behind them. At a Claim they may sit. ' +
      'The Master of the Chairs keeps them dusted, and keeps the tokens the houses give when they agree to sit. ' +
      'He has not been given one in fifty years. He dusts them anyway.',
  },
  {
    id: 'seat_seventh_clause',
    title: 'The Seventh Clause',
    category: 'law',
    available: { flag: 'clue.seventh_clause_read' },
    text:
      'Entered in the Hall\'s record on the day it was read aloud in Parley, at the demand of Zetwal\'s envoy. ' +
      'Read by the Keeper of the Archive, from a page sealed with the Throne\'s wax fifty years before. ' +
      '"The harbor of Xaraguá and its waters are given into the keeping of the Crown of Aldermoor," it reads. ' +
      '"At the Crown\'s pleasure, to be revisited." ' +
      'The Keeper\'s note: the page bears no signature, only the Throne\'s clerk\'s seal. ' +
      'The seventh ribbon of the bound Accord carries no witness knot. ' +
      'The Lord Regent\'s answer: the Charter has stood on it for fifty years. ' +
      'The envoy of Xaraguá was not present. Xaraguá has no envoy at the Seat.',
  },
  {
    id: 'seat_weaving',
    title: 'The Weaving',
    category: 'religion',
    text:
      'Before the houses, the faiths say, the goddess Elodie wove the realm out of eight threads, one for each people. ' +
      'The Gaze says she watches the weaving still, and remembers every knot. ' +
      'The Witness says she wove it as a contract, and every thread was asked. ' +
      'The Four Hands say there was no weaving, only land, and that the land remembers on its own. ' +
      'The Quiet Crown says nothing, which it calls the oldest answer. ' +
      'Every faith agrees on one thing: there were eight threads. ' +
      'The Archive\'s copy of this book has a thread sewn into its spine. It is teal.',
  },
  {
    id: 'seat_founding_compact',
    title: 'The Founding Compact',
    category: 'law',
    text:
      'The Compact is older than the Accord, and the Accord was written under it. ' +
      'Clause Six: every clause of a treaty made at the Seat is read aloud to every signatory before it is sealed. ' +
      'A clause not read is not agreed. ' +
      'Clause Nine: a sealed page may be opened and heard in the Hall, when the envoy of a signatory house demands it in Parley. ' +
      'Clause Twelve: no steel is drawn inside the eight gates. ' +
      'The Witness priests call the Compact the realm\'s first contract, and teach it to their apprentices by heart. ' +
      'The Archive\'s copy is worn thin at Clause Six.',
  },
  {
    id: 'seat_accord_sealed',
    title: 'The Sun Accord, Sealed',
    category: 'history',
    text:
      'The Sun Accord ended the Ash Wars. It was signed in Pòdlimyè and brought to the Seat to be bound and sealed. ' +
      'Its binding holds six pages and seven ribbons, one ribbon for each clause. ' +
      'The signatories were Zetwal, Ardencia, Al-Doria as witness, and the Crown of Aldermoor. ' +
      'Xaraguá fought in the war and is named in its first page. It is not named among the signatories. ' +
      'The sealing was done by the Throne\'s clerk, before the Marshal of Zetwal and the Crown\'s envoy. ' +
      'The record of the sealing says the Lord of Ardencia "was not present at the close." It does not say why.',
  },
  {
    id: 'seat_throne_clerks',
    title: "The Throne's Clerks",
    category: 'history',
    text:
      'The Throne\'s clerks keep the Seat\'s records, read what is sealed, and seal what is read. ' +
      'A clerk swears to write only what is said, and to say nothing of what is written. ' +
      'Most keep the oath. One kept it better than he meant to. ' +
      'The clerk who sealed the Sun Accord never spoke again after that day. ' +
      'His fellows said he was ill. His wife said he was ashamed. ' +
      'He went on working for nine more years, and he wrote in a very beautiful hand. ' +
      'When he died, his register for the year of the Accord could not be found.',
  },
  {
    id: 'seat_claimant_families',
    title: 'The Claimant Families',
    category: 'genealogy',
    text:
      'The families with a claim to stand on the Throne tile, by the Founding Compact\'s count. ' +
      'Rodriguez of Ardencia, through the Brasador line, a claim the house has never pressed. ' +
      'Jean-Philippe of Zetwal, through Kay Soley, the island\'s old governors. ' +
      'Stillwater of Aldermoor, through the Crown. Three others are extinct now, or married out, or simply forgotten. ' +
      'A claimant must be of a claimant family and must stand with the houses behind her. ' +
      'No claimant has stood on the tile in fifty years, and the Regent has not asked for one. ' +
      'Someone has written in the margin, in a clerk\'s small hand: "Limyè? A temple name, not a house."',
  },
  // ---- Ordvik (Chapter 6): the Saga Tent's eight, on hides and tally sticks, and the Moot's three ----------
  {
    id: 'skarragol_ulfgar_oath',
    title: 'Ulfgar\'s Oath',
    category: 'law',
    text:
      'Ulfgar Ironvow was the first chieftain of the horse clans and the fjord clans together. ' +
      'Before him the clans swore on whatever was to hand, and broke whatever they swore on. ' +
      'Ulfgar cut a pole of black ash, bound nine horse-tails to it, and cut his palm over it. ' +
      'He said: an oath sworn on a thing can be seen, and what can be seen can be counted. ' +
      'From that day the Ironvow swear on the standard or not at all. ' +
      'A chieftain who loses it may not bind the clans to anything until it stands again. ' +
      'The skalds say Ulfgar wanted it that way. A people that can lose its oath will guard it. ' +
      'The Sky-Riders say he only wanted a stick to wave. Both stories are told at every fire.',
  },
  {
    id: 'skarragol_sarnai_ride',
    title: 'Sarnai\'s Ride',
    category: 'war',
    text:
      'In the last winter of the war, the Crown camped its supply train on the far shore of the fjord. ' +
      'Grain for three armies sat in its wagons, and the ice between was guarded by sentries with muskets. ' +
      'Sarnai Ironvow crossed the ice at night with forty riders hidden in a herd of steppe horses. ' +
      'She whistled, and the herd walked where the whistle walked. The sentries watched horses. ' +
      'Nobody writes the whistle down. The skalds say it was three notes, and leave it there. ' +
      'The wagons burned. Nobody who dropped his musket was touched, and half the grain went south to Zetwal. ' +
      'The spring ice took half her riders on the way home. Nine of them are under the cairns on the plateau. ' +
      'The Crown never camped on that shore again.',
  },
  {
    id: 'skarragol_law_moot',
    title: 'The Law of the Moot',
    category: 'law',
    text:
      'The Moot sits when the horn blows at first light, and not before. ' +
      'The chieftain speaks first and votes last. The lawspeaker speaks only the law, and is never asked twice. ' +
      'What the standard binds, no vote may undo. What no oath forbids, the council may sell. ' +
      'A vote taken while the standard is gone is lawful. The law also names it shameful, and both are written. ' +
      'If the standard stands on its pole when the horn blows, every vote called without it falls. ' +
      'A guest of the Moot may ask for a prisoner under an envoy\'s bond. If the prisoner runs, the guest pays. ' +
      'The lawspeaker keeps these words on painted hides. Everyone quotes them. Nobody reads them.',
  },
  {
    id: 'skarragol_sky_riders',
    title: 'The Sky-Riders',
    category: 'religion',
    text:
      'The Sky-Riders are the wind sect of the Four Hands, and the plateau is full of them. ' +
      'They swear to the open sky, because the sky cannot be stolen, sold or burned. ' +
      'They keep no temple. A Sky-Rider prays on horseback, facing the wind, with the reins slack. ' +
      'They have argued with the Witness elders of Ordvik for three hundred years, mostly about the standard. ' +
      'The elders say an oath you cannot lose is an oath you cannot keep. ' +
      'The Sky-Riders say an oath on a stick is a stick. The two sit at the same fires and share the same salt. ' +
      'Sarnai Ironvow, the skalds say, swore on the sky and on the pole, and told both sides they were right.',
  },
  {
    id: 'skarragol_furs_salt',
    title: 'Furs, Salt and Horses',
    category: 'trade',
    text:
      'Ordvik sells three things: furs from the plateau, fish from the fjord, and horses from everywhere. ' +
      'It buys one thing it cannot make, which is salt. Without salt the fish rot and the winter kills. ' +
      'Before the Crown\'s blockade, Dorini salt came up the coast in the trading jarl\'s longships. ' +
      'Since the blockade, salt costs three times what it did, and the fleet sits on the shingle. ' +
      'The Crown offers compensation for the blockade it imposes. The price is the fleet. ' +
      'The trading jarl says a people who sell their ships to buy salt will buy salt forever. ' +
      'The raiding jarl says a fleet that cannot raid is firewood. Both are counting the same hulls.',
  },
  {
    id: 'skarragol_mare_sky',
    title: 'The Mare in the Sky',
    category: 'folklore',
    text:
      'The herders say there is a mare in the night sky, nine stars round a tenth, and she walks the year. ' +
      'In spring she grazes low over the fjord. At first snow she stands over the plateau\'s high stones. ' +
      'Nine riders who went out on the ice with Sarnai never came home. ' +
      'Their cairns stand in a ring on the plateau, round a flat stone scored with lines. ' +
      'The old herders say that on the right night the mare stands over the stone, and the lines point somewhere. ' +
      'Nobody young has seen it. The old herders will not say where the lines point. ' +
      'They say only that the riders left something for the one who can read the sky as Sarnai did.',
  },
  {
    id: 'skarragol_who_married',
    title: 'Who Married Whom',
    category: 'gossip',
    text:
      'A skald\'s notes on the great families, not to be sung at a feast. ' +
      'Torvald married late and lost his wife early. His daughter rides better than he ever did, and he knows it. ' +
      'Hrafn has married twice, both times for ships. ' +
      'The trading jarl has never married, and keeps a tally stick for every offer. ' +
      'A daughter of the khatun\'s household married a Brasador lord in the Ash Wars, and came home alone. ' +
      'The boy stayed in Ardencia. The eastern clans still send a rider to Cenizal every year to ask after him. ' +
      'The rider is always told the boy is well, and goes home, and comes back the next year.',
  },
  {
    id: 'skarragol_ironvow_line',
    title: 'The Ironvow Line',
    category: 'genealogy',
    text:
      'The chieftains of the Ironvow, as the skalds count them. ' +
      'Ulfgar, who cut the standard and joined the clans. Many after him, whose names are on the poles. ' +
      'Sarnai, who broke the Crown\'s supply train on the fjord ice in the last winter of the war. ' +
      'She swore for the Ironvow at the Accord, and came home to bury nine riders. ' +
      'Torvald her son, chieftain now, who has kept the fleet on the water through three hard winters. ' +
      'Bayarmaa his daughter, the standard\'s guard, who rides with the horn-riders and speaks to her horse more than to the Moot. ' +
      'The skald who wrote this added, small: she will be chieftain, or she will be gone.',
  },
  {
    id: 'skarragol_standard_keeping',
    title: 'The Standard\'s Keeping',
    category: 'law',
    text:
      'The guard roster for the Ironvow standard, kept by the lawspeaker, for the nights of this autumn. ' +
      'Each night two names: one from the horse clans, one from the fjord clans. ' +
      'On the night it went, the horse clans\' name is Bayarmaa, Torvald\'s daughter, written plainly. ' +
      'The fjord clans\' name has been struck out with a heavy line, and no other written in its place. ' +
      'Under it, in the lawspeaker\'s hand: the struck name was a rider of the raiding jarl\'s household. ' +
      'He asked to be moved to the quay that night, and was. Nobody has asked him why. ' +
      'The lawspeaker\'s note ends: the law does not ask questions. Envoys may.',
  },
  {
    id: 'skarragol_crown_offer',
    title: 'The Crown\'s Offer',
    category: 'trade',
    text:
      'A copy of the offer the Crown\'s guest laid before the council, in a clerk\'s careful hand. ' +
      'The Throne will pay compensation for the blockade of the northern coast, in gold, this winter. ' +
      'In return, the Ironvow fleet passes into the Throne\'s keeping for the duration of the war. ' +
      'The offer stands until the morning horn of the council\'s vote, and not a moment after. ' +
      'It is signed by the Throne\'s compensation office. No person\'s name is on it. ' +
      'In the margin, in a heavier hand, someone has written: whose war? ' +
      'Someone else has written under that: the Throne\'s. And under that, nothing more.',
  },
  {
    id: 'skarragol_compensation',
    title: 'Compensation Claims',
    category: 'history',
    text:
      'A ledger of claims the Throne\'s compensation office has paid in the last ten years. ' +
      'Ships lost to the blockade, at half their value. Herds lost to Crown requisitions, at a third. ' +
      'A temple in Jwaladesh, for a sacred lamp broken by soldiers, paid in full and quickly. ' +
      'A guild in Al-Doria, for papers lost in a fire, paid before the fire was reported. ' +
      'A great many claims for the recovery of objects, paid to persons not named. ' +
      'Whoever kept the ledger stopped adding to it last spring. ' +
      'The last line reads: the office pays what it is told to pay, and is told by whom it pays.',
  },
  // ---- Kirinoura (Chapter 7): the Lantern Library's nine (and the spy ledger, back on its shelf after K-2), the Hall's four --
  {
    id: 'kuroshi_genzo_ear',
    title: 'Genzō\'s Ear',
    category: 'history',
    text:
      'Suzumori Genzō was a harbour clerk who could not stop listening. ' +
      'He kept a book of what sailors said in the tea houses. ' +
      'Which ship carried what, which captain owed whom, which Crown officer drank. ' +
      'He never repeated a word of it. ' +
      'He only wrote it down. ' +
      'When the Crown\'s governor of the fog coast was recalled in disgrace, everyone knew who had kept the book. ' +
      'Nobody could prove it. ' +
      'The Suzumori say that is how a house is founded: by being trusted with things and keeping them. ' +
      'Genzō\'s rule is still painted over the Hall\'s records room: write everything, say nothing, sell nothing. ' +
      'Somebody has added, in a smaller hand, a fourth line: until it matters.',
  },
  {
    id: 'kuroshi_sayo_network',
    title: 'Sayo\'s Network',
    category: 'war',
    text:
      'In the Alliance War, Lady Sayo Suzumori ran the realm\'s listening. ' +
      'Fishers, clerks, tea girls and lantern-lighters carried slips to her war room in the file house, and she pinned them to a map. ' +
      'The Marshal of Zetwal knew where the Crown would be before the Crown did. ' +
      'Sayo talked to her people through the fog with lanterns: white and red, in threes, lit and never written. ' +
      'The code was the point. ' +
      'A thing that is written can be sold. ' +
      'Her agents who were caught died without a name. ' +
      'Sayo kept those names herself, and asked the winners for one thing: write them down. ' +
      'Nobody has, yet.',
  },
  {
    id: 'kuroshi_suzumori_line',
    title: 'The Suzumori Line',
    category: 'genealogy',
    text:
      'Genzō, the clerk who listened. ' +
      'His daughter Sayo, who ran the war\'s listening and lit the fog with lanterns. ' +
      'Her daughter Kaede, who rules Kirinoura from a writing table and has never raised her voice in council. ' +
      'Kaede\'s son Haru, who follows people for his mother and is, by every account, very bad at not being seen. ' +
      'The Suzumori marry quietly and outlive their enemies. ' +
      'Their crest is a bell in a grove: a bell is heard, the saying goes, and a grove hears. ' +
      'No portrait of any Suzumori hangs in the Hall of Screens. ' +
      'They say it is modesty. ' +
      'Their enemies say it is a precaution.',
  },
  {
    id: 'kuroshi_informants_petition',
    title: 'The Informants\' Petition',
    category: 'law',
    text:
      'To the Throne of the realm, from the people of Kirinoura who carry what they hear to the Hall. ' +
      'We ask to be named in the law. ' +
      'Not to be thanked: to be named, as soldiers are named, so that our widows are paid. ' +
      'We ask that no file with our names in it be sold, copied or shown to any foreign officer. ' +
      'We ask that a broker who sells our names be tried as a man who sells soldiers. ' +
      'Fifty signatures, and fifty thumbprints for those who cannot write. ' +
      'Filed with the Throne\'s clerks after the Alliance War. ' +
      'Returned unread, three times. ' +
      'The Hall keeps a copy here. ' +
      'The council still reads it aloud every new year.',
  },
  {
    id: 'kuroshi_balance_silence',
    title: 'Balance and Silence',
    category: 'religion',
    text:
      'The Witness keepers of Kirinoura teach that the Gaze is a scale, and silence is one of its weights. ' +
      'A silence kept for the weak is a shield: the fisher\'s name, the widow\'s debt, the child\'s mistake. ' +
      'A silence kept for the strong is a wall: the council\'s price, the governor\'s page, the broker\'s list. ' +
      'The keepers do not ask which silence a person keeps. ' +
      'They ask who it is kept for. ' +
      'Every keeper takes one vow at her ordination, said in a whisper so that only the Witness hears. ' +
      'Nobody else has ever been told what it is. ' +
      'The keepers say that is the lesson.',
  },
  {
    id: 'kuroshi_burned_temple',
    title: 'The Burned Temple',
    category: 'history',
    text:
      'In the Ash Wars, a Crown paper came to Kirinoura\'s council. ' +
      'It said the fire priests of Agnipur were hiding Crown deserters in their temple. ' +
      'The council sent ships. ' +
      'The temple burned. ' +
      'There were no deserters in it at all. ' +
      'The paper was false, and the Crown has never said who wrote it. ' +
      'The elder who signed the order for Kuroshi is still alive, and goes to the library most mornings, and stands by this book. ' +
      'Agnipur has never accepted an apology from Kirinoura, because none has been sent. ' +
      'The elder says one has been written, every year, and never posted.',
  },
  {
    id: 'kuroshi_silk_tea',
    title: 'Silk, Tea and Secrets',
    category: 'trade',
    text:
      'Kirinoura sells three things: silk, tea, and what it knows. ' +
      'The first two are taxed. ' +
      'Silk comes down from the hill farms in bales wrapped in oiled paper. ' +
      'Tea comes in by the marsh boats, before the fog lifts. ' +
      'Secrets come in every other way: in a tea house, on a bridge, under a lantern. ' +
      'A merchant who wants to buy the third thing asks for the second, very politely, and waits. ' +
      'The tea houses keep a screen half open on the street for this reason. ' +
      'A sensible visitor drinks the tea, admires the silk, and says nothing he would mind hearing again.',
  },
  {
    id: 'kuroshi_tea_whispers',
    title: 'Tea House Whispers',
    category: 'gossip',
    text:
      'Overheard at the tea house by the middle bridge this season, and written down by somebody who should know better. ' +
      'The Crown\'s observer takes his tea with the same courteous man every day, and never pays. ' +
      'The keeper of files has a new coat. ' +
      'Lady Kaede\'s son was seen on four roofs in one night and fell off one of them. ' +
      'Gold has been flowing out of Ardencia for years, to places no one should be funding, and the Alcázar says nothing. ' +
      'The marsh fishers print something at night. ' +
      'Nobody has asked what. ' +
      'The fog is thicker than it was last year, and the lanterns are lit at noon.',
  },
  {
    id: 'kuroshi_nightingale_floor',
    title: 'The Nightingale Floor',
    category: 'folklore',
    text:
      'Lady Sayo\'s House on the west canal has a floor that sings. ' +
      'Every board is laid on iron cramps that chirp like a nightingale when a foot comes down on them. ' +
      'Sayo had it laid in the war, so that no one could walk to her door unheard. ' +
      'The house has been shut since she died. ' +
      'Children say the floor still sings at night, though nobody walks it. ' +
      'The floor-maker who laid it had an apprentice, who is old now and makes keys. ' +
      'They say the floor can be walked in silence, if you know which boards Sayo stepped on. ' +
      'They say she only ever told one person.',
  },
  {
    id: 'kuroshi_spy_ledger',
    title: 'The Suzumori Spy Ledger',
    category: 'war',
    available: { flag: 'side.spy_ledger.done' },
    text:
      'The Ash Wars, as Kirinoura\'s informants counted them, in a clerk\'s hand. ' +
      'The Crown\'s own war rolls say Lord Rael of Ardencia butchered a Crown column on the Ash Road. ' +
      'The Suzumori ledger says something else. ' +
      'Forty-one Crown marines were taken on the Ash Road by Brasador riders, and held, and fed. ' +
      'Nine died. ' +
      'All nine were killed by the Crown\'s own volleys, fired into the column from the ridge after it had surrendered. ' +
      'The ledger names the ridge\'s captain and the hour. ' +
      'It does not say who gave him the order. ' +
      'Beside the entry, in red ink: Not to be read aloud while the Crown keeps an observer in the Hall.',
  },
  {
    id: 'kuroshi_neutrality_order',
    title: 'The Neutrality Order',
    category: 'law',
    text:
      'By order of the council of Kirinoura, while the Throne\'s Parley sits and after it: Kirinoura takes no side. ' +
      'The file house is sealed. ' +
      'No file leaves it. ' +
      'No envoy enters it. ' +
      'No informant of the Suzumori is named to anyone, for any price. ' +
      'The keeper of files holds the seal, and answers for it with his post. ' +
      'This order protects the people who tell the Hall what they know. ' +
      'It is the only protection they have. ' +
      'Pasted beside the file house door, and copied to every bridge. ' +
      'Somebody has scratched a line under the word sealed, very lightly, with a fingernail.',
  },
  {
    id: 'kuroshi_buyers_mark',
    title: 'The Buyer\'s Mark',
    category: 'law',
    available: { flag: 'clue.buyers_mark' },
    text:
      'A buying-list on Crown paper, in Throne sols. ' +
      'Four lines, four prices: three large, one larger. ' +
      'Every name has been cut out of the paper with a knife, cleanly, after the ink was dry. ' +
      'Beside one of the prices, a stamped mark in black: a closed hand. ' +
      'It is not a Crown seal. ' +
      'It is not the mark of any house. ' +
      'Kayla\'s note, pinned to it in her small hand: The names were cut before the list reached the broker. ' +
      'Somebody knew it would be sold. ' +
      'The list does not say which house was bought, or whether the price has been paid yet. ' +
      'It only says that one of them can be.',
  },
  {
    id: 'kuroshi_outflows',
    title: 'The Ledger of Outflows',
    category: 'trade',
    available: { flag: 'clue.ardencia_outflows' },
    text:
      'A copy of an Ardencian counting-house ledger, in the treasury\'s own hand. ' +
      'Gold leaves the Alcázar\'s treasury every season, for twenty years. ' +
      'Large sums, larger in the war years. ' +
      'The destinations are written in a cipher. ' +
      'The amounts and the dates are not. ' +
      'Kayla\'s note: Ardencia\'s counting-house hand; Kirinoura has copied enough of it to know it. ' +
      'The key is not the Crown\'s and not one this city has ever held. ' +
      'Samira, reading it over Gianna\'s shoulder, said only that a coin she once had was minted somewhere else. ' +
      'Nobody here can say where the gold went. ' +
      'Kayla would say no more than that.',
  },
  {
    id: 'kuroshi_fox_receipts',
    title: 'The Paper Fox\'s Receipts',
    category: 'law',
    available: { flag: 'clue.fox_receipts' },
    text:
      'Eleven years of receipts from a broker of Kirinoura, kept in a lacquer box under the file house floor. ' +
      'Each is for copies of files from the sealed house: troop counts, harbour charts, informants\' names. ' +
      'Each is paid in Throne sols. ' +
      'Each is countersigned in Aldermoor violet by the Throne\'s observer. ' +
      'The keeper of files is paid on every one, in a smaller hand at the foot. ' +
      'The broker\'s own note on the last: Copies only. ' +
      'The originals are perfectly safe. ' +
      'Read aloud to the council at dawn by the signal master, who did not raise his voice once, all the way through.',
  },
  // ---- Agnipur (Chapter 8): the Palm-Leaf Library's nine, the Court's treasury book and records (the ledger after beat 7) --
  {
    id: 'jwaladesh_tejaswini',
    title: "Rani Tejaswini's Flame",
    category: 'religion',
    text:
      'Rani Tejaswini founded the Agnivansh with a lamp and a vow. ' +
      'The lamp was a clay bowl of ghee she carried down from the hills when her village burned. ' +
      'She set it on a rock above the harbor and swore it would not go out while one of her line was alive to tend it. ' +
      'The rock is the altar now, and the Court of the Flame is built round it. ' +
      'Her teaching is short, and the Keepers repeat it every morning: hesitation is the only true death. ' +
      'The Keepers say it means a hand must never wait when the flame needs it. ' +
      'Older readers note that Tejaswini waited three days in the rain for her bowl to dry before she lit it. ' +
      'The Keepers do not mention this. ' +
      'The bowl is still under the wick, cracked and mended with brass.',
  },
  {
    id: 'jwaladesh_harbor_chain',
    title: 'The Harbor Chain',
    category: 'war',
    text:
      'In the Alliance War the Crown\'s fleet held Agnipur behind its own harbor chain. ' +
      'The Crown had taken the chain tower on the mole and drawn the links taut across the harbor mouth. ' +
      'No ship could come in, and none could leave. ' +
      'Arjun of the Agnivansh took seven riders along the mole at night, at the Crown\'s tower. ' +
      'A Zetwal officer stood with him at the old chain lamp and lit the signal for the allied ships. ' +
      'Cannon fire came from the hulls beyond the chain. ' +
      'Two riders fell on the mole. ' +
      'The tower\'s gate went down, the chain dropped, and five rode home. ' +
      'Every new moon after, the runners carried the lamp\'s fire up to the temple\'s wick. ' +
      'The chain has been the city\'s ever since. Seven rode out, the song says. Five came home.',
  },
  {
    id: 'jwaladesh_law_flame',
    title: 'The Law of the Flame',
    category: 'law',
    text:
      'Who may tend the flame: the Keepers of the Four Hands, under the Court, and the Court\'s engineer, who alone may measure it. ' +
      'Who pays for its oil: the treasury of the Agnivansh, from the harbor\'s dues, by ancient right. ' +
      'Who may see it: anyone who climbs the temple steps, at any hour, without asking leave. ' +
      'That last clause is the oldest in the book. ' +
      'It is underlined in three different inks. ' +
      'The law says nothing about curtains. ' +
      'A commentary in the margin, unsigned, observes that a flame that must be hidden is a flame the city has stopped paying for. ' +
      'Another hand has written under it: or one that somebody else has started paying for. ' +
      'Nobody has crossed either out.',
  },
  {
    id: 'jwaladesh_flame_keepers',
    title: 'The Flame Keepers',
    category: 'religion',
    text:
      'The Flame Keepers are the fire\'s hand of the Four Hands, the faith of Jwaladesh. ' +
      'They believe the world is held in four hands: fire, water, earth and breath. ' +
      'A hand that lets go is a hand that has failed, and so a Keeper never lets the flame go untended for a single hour. ' +
      'They take vows of service, not silence. ' +
      'A Keeper may argue with anyone, about anything, so long as the flame is tended while they do. ' +
      'Their rite is plain: the wick is trimmed in the open, the oil poured in the open, and the city may watch. ' +
      'This book was copied before the curtain went up. ' +
      'A newer note says the Keepers voted on the curtain, four to three, and that the three are still arguing.',
  },
  {
    id: 'jwaladesh_oil_ghee',
    title: 'Oil, Ghee and Grain',
    category: 'trade',
    text:
      'Prices in the Lamp Bazaar, kept by the spice row\'s guild for a hundred years. ' +
      'Grain has gone up and down with the rains. ' +
      'Ghee has gone up with the cows. ' +
      'Oil stayed at four the measure for most of a century, because the harbor brought it in faster than the city could burn it. ' +
      'Two years ago the entries change. ' +
      'A new buyer at the quay, named only as the Seth, bought every jar that landed, then every jar in the warehouses. ' +
      'The price went to nine, then twenty, then forty. ' +
      'The lamp-sellers kept selling lamps. ' +
      'The last entry, in a tired hand: forty the measure. Was four. ' +
      'Under it, scratched: and the Crown\'s launch at the Seth\'s steps every week.',
  },
  {
    id: 'jwaladesh_relay',
    title: 'The Relay',
    category: 'folklore',
    text:
      'Every new moon the runners carry the sea\'s fire from the chain lamp to the temple\'s wick. ' +
      'Harbor to temple before it gutters. ' +
      'The wind comes off the sea up the main street, so the runners never take it. ' +
      'Their way is older than the bazaar\'s tower and most of its lanes. ' +
      'Left at the dyers, through the arch, along the wall, and in at the temple steps. ' +
      'Children learn it as a skipping rhyme before they can run it. ' +
      'When a runner is too old to run, the hall gives her a lamp on a pole and makes her chief. ' +
      'The rhyme has a last line nobody sings any more. ' +
      'When the lamp is dark, the runners wait. When the lamp is lit, the runners go. ' +
      'The chain lamp has been dark two years.',
  },
  {
    id: 'jwaladesh_duels',
    title: 'Duels Over Breakfast',
    category: 'gossip',
    text:
      'A broadsheet from the spice row, pinned up and torn down weekly. ' +
      'This week: the Court\'s son has fought eleven duels this month, all over arguments, all won, all on one breath. ' +
      'His mother has asked him to stop. ' +
      'He has asked her for an argument. ' +
      'The dyer who said the Crown would never hold the chain lost his sword in the dust on the harbor stair. ' +
      'The dyer says he still thinks he was right. ' +
      'The Court\'s son says that is the dyer\'s right, and that he will be happy to settle it again on Thursday. ' +
      'Odds at the milk stall: the son, every time. ' +
      'Odds on him getting his breath back before noon: none offered.',
  },
  {
    id: 'jwaladesh_burned_temple',
    title: 'Our Burned Temple',
    category: 'history',
    text:
      'In the Ash Wars a Crown paper came to Kirinoura saying our temple at the salt gate hid Brasador arms. ' +
      'The Suzumori believed it. ' +
      'Their men burned the temple in a night, and found nothing in the ashes but the bowls. ' +
      'The paper was false. ' +
      'The Crown never said who wrote it, and the Suzumori never asked loudly enough. ' +
      'We rebuilt the temple in white stone, and we have never taken a Suzumori crane since. ' +
      'Kirinoura keeps its own account of the fire, they say, and it is shorter than ours. ' +
      'A reader who has both will notice that neither names the man who signed the order. ' +
      'Somebody has written in the margin: he is still alive, and sorry. That is not enough. It is a start.',
  },
  {
    id: 'jwaladesh_agnivansh_line',
    title: 'The Agnivansh Line',
    category: 'genealogy',
    text:
      'Rani Tejaswini, who carried the bowl down from the hills and lit it on the rock. ' +
      'Her grandson Arjun, who took the Harbor Chain back with seven riders and a Zetwal hand on the lamp. ' +
      'His daughter Meera, who rules from the seat below the altar, says little, and says it once. ' +
      'Her son Vikram, who says a great deal, usually out of breath, usually with a sword in his hand. ' +
      'The Agnivansh do not paint portraits. ' +
      'Each of them is shown in the Court\'s records by the height of the flame on the day they took the seat. ' +
      'Tejaswini\'s was a hand. ' +
      'Arjun\'s was an arm. ' +
      'Meera\'s was the height of a lamp. ' +
      'There is a blank line under hers, measured but not yet written.',
  },
  {
    id: 'jwaladesh_treasury_book',
    title: 'The Treasury Book',
    category: 'law',
    text:
      'The Court of the Flame\'s treasury book, in the treasurer\'s fair hand. ' +
      'Harbor dues in, oil out, every month for thirty years, the columns ruled in red. ' +
      'Two springs ago the oil column grows longer than the dues column. ' +
      'Then the dues column stops. ' +
      'A note: the Seth holds the harbor\'s oil by contract; the harbor\'s dues are owed to the Seth until further notice. ' +
      'After that the pages are ruled, and dated, and blank. ' +
      'On the last written page, small, in the same fair hand: the treasury is empty and the Court has one word. ' +
      'Under it, in a different hand, a measuring rod\'s notches: a thumb, a thumb, a thumb.',
  },
  {
    id: 'jwaladesh_priests_decision',
    title: "The Priests' Decision",
    category: 'religion',
    text:
      'The council of the Keepers, in session this month, on the state of the flame. ' +
      'Moved: that the flame is low, and the oil is held by the Seth, and the Crown\'s factor waits for the Court\'s word. ' +
      'Moved: that if the city saw the flame so low, the city would lose heart, and the Court would have to sell the chain. ' +
      'Resolved, four to three: that the altar be curtained, and the rooftop mirrors turned down for cleaning, until oil is found. ' +
      'The three who voted no have signed their names under the four. ' +
      'One of the three is the junior priest. ' +
      'The senior Keeper\'s signature is the largest on the page. ' +
      'Nobody has signed for the city.',
  },
  {
    id: 'jwaladesh_oil_contracts',
    title: 'Oil Contracts',
    category: 'trade',
    text:
      'Contracts for the temple\'s oil, bound together with brass rings. ' +
      'Every one is signed by the Court\'s treasurer and by Seth Dhanraj, merchant, of the harbor. ' +
      'Each sells the Seth the right to hold the harbor\'s oil until the temple can pay the price of the day. ' +
      'Each is witnessed at the altar, as the law requires. ' +
      'The price of the day is set at the Oil Exchange. ' +
      'The Oil Exchange is owned by Seth Dhanraj. ' +
      'A clerk has added a note in pencil, then rubbed it out, then written it again more faintly. ' +
      'It says: who pays the Seth? Nobody has answered it. ' +
      'The last contract is dated last month.',
  },
  {
    id: 'jwaladesh_ledger_advances',
    title: "Dhanraj's Ledger of Advances",
    category: 'trade',
    available: { flag: 'story.dhanraj_beaten' },
    text:
      'The Seth\'s own ledger, taken from his lap in the oil store. ' +
      'Every jar in the harbor, bought with advances from the Throne\'s purchasing office in Kingsmere. ' +
      'Each advance is countersigned by the Crown\'s oil-factor in violet ink. ' +
      'The sums are large, regular and patient, two years of them. ' +
      'The Seth never paid for a jar with his own money. ' +
      'At the foot of the last page, in the factor\'s hand: hold until the Court signs for the chain. ' +
      'Under it, in the Seth\'s hand, smaller: I was never told why. ' +
      'The ledger now sits on the Court\'s records shelf beside the contracts it paid for. ' +
      'The junior priest reads it aloud to anyone who asks.',
  },
];

export const SHELVES: readonly Shelf[] = [
  { id: 'archive_history', name: 'Shelf: History and War', books: ['zetwal_founding', 'zetwal_alliance_war', 'zetwal_ash_wars_temple'] },
  { id: 'archive_faith', name: 'Shelf: Faith', books: ['zetwal_gaze_primer', 'zetwal_blessed_seat', 'zetwal_say_their_names', 'zetwal_four_hands'] },
  { id: 'archive_tales', name: 'Shelf: Tales and Notes', books: ['zetwal_bridge_tale', 'zetwal_hutia_lamp', 'zetwal_overdue', 'zetwal_ash_wars_anicette'] },
  { id: 'hall_law', name: 'Shelf: Law and Houses', books: ['zetwal_sun_accord', 'zetwal_crown_chronicle', 'zetwal_eight_houses'] },
  { id: 'hall_records', name: 'Shelf: Harbor Records', books: ['zetwal_harbor_tolls', 'zetwal_quiet_tract'] },
  // Xaraguá: the Song House and the Caney of Anaco (CAPITALS.md 2).
  { id: 'song_history', name: 'Shelf: Songs of the Line', books: ['xaragua_song_guanin', 'xaragua_caona_road', 'xaragua_first_oath', 'xaragua_caciques'] },
  { id: 'song_spirit', name: 'Shelf: Springs and Spirits', books: ['xaragua_roots_tides', 'xaragua_opia', 'xaragua_hutia'] },
  { id: 'song_accounts', name: 'Shelf: Accounts', books: ['xaragua_cassava_salt', 'xaragua_charter'] },
  { id: 'caney_records', name: "Shelf: The Cacique's Records", books: ['xaragua_council_minutes', 'xaragua_anaco_letter', 'xaragua_healer_notes', 'xaragua_customs_receipts'] },
  // Ardencia (Chapter 3): La Biblioteca Vieja's three shelves, and the Alcázar's records room.
  { id: 'ard_shelf_war', name: 'Shelf: The Ash Wars', books: ['ardencia_brasador_count', 'ardencia_cendre'] },
  { id: 'ard_shelf_law', name: 'Shelf: Oaths and Faith', books: ['ardencia_oaths', 'ardencia_witness'] },
  { id: 'ard_shelf_trade', name: 'Shelf: Iron and Gossip', books: ['ardencia_iron_trade', 'ardencia_kitchen_maids'] },
  { id: 'alcazar_records', name: "Shelf: The Treasurers' Row", books: ['ardencia_last_report', 'ardencia_blade_law'] },
  // Al-Doria (Chapter 4): the House of Ledgers' three lecterns, and the Majlis's archive of contracts.
  { id: 'ledgers_trade', name: 'Lectern: Counting and Trade', books: ['aldoria_letter_numbers', 'aldoria_eight_gates'] },
  { id: 'ledgers_law', name: 'Lectern: Contracts and Faith', books: ['aldoria_on_contracts', 'aldoria_witness_market'] },
  { id: 'ledgers_city', name: 'Lectern: The City', books: ['aldoria_dorini_promise', 'aldoria_city_water'] },
  { id: 'majlis_contracts', name: 'Shelf: The Archive of Contracts', books: ['aldoria_vault_register', 'aldoria_crown_preference'] },
  // Eightgate (Chapter 5): the Throne Hall's records room, and the Throne Archive (readable from the bell on).
  { id: 'hall_records', name: "Shelf: The Hall's Records", books: ['seat_regent_commission', 'seat_petitions_breach', 'seat_council_eight', 'seat_seventh_clause'] },
  { id: 'archive_shelves', name: 'Shelves: The Throne Archive', books: ['seat_weaving', 'seat_founding_compact', 'seat_accord_sealed', 'seat_throne_clerks', 'seat_claimant_families'] },
  // Ordvik (Chapter 6): the Saga Tent's hides and tally sticks, and the lawspeaker's painted hides in the Moot.
  { id: 'saga_hides_a', name: 'Hides: Oaths and the Law', books: ['skarragol_ulfgar_oath', 'skarragol_sarnai_ride', 'skarragol_law_moot', 'skarragol_sky_riders'] },
  { id: 'saga_hides_b', name: 'Tally sticks: Trade and Lines', books: ['skarragol_furs_salt', 'skarragol_mare_sky', 'skarragol_who_married', 'skarragol_ironvow_line'] },
  { id: 'moot_hides', name: "The lawspeaker's hides", books: ['skarragol_standard_keeping', 'skarragol_crown_offer', 'skarragol_compensation'] },
  // Kirinoura (Chapter 7): the Lantern Library's three shelves, the Neutrality Order at the file house door, the Hall's records.
  { id: 'kur_lib_a', name: 'Shelf: The House of Suzumori', books: ['kuroshi_genzo_ear', 'kuroshi_sayo_network', 'kuroshi_suzumori_line'] },
  { id: 'kur_lib_b', name: 'Shelf: Law and the Witness', books: ['kuroshi_informants_petition', 'kuroshi_balance_silence', 'kuroshi_burned_temple'] },
  { id: 'kur_lib_c', name: 'Shelf: Silk, Tea and Rumour', books: ['kuroshi_silk_tea', 'kuroshi_tea_whispers', 'kuroshi_nightingale_floor', 'kuroshi_spy_ledger'] },
  { id: 'kur_hall_order', name: 'The Neutrality Order', books: ['kuroshi_neutrality_order'] },
  { id: 'kur_hall_records', name: "Shelf: The Hall's Records", books: ['kuroshi_buyers_mark', 'kuroshi_outflows', 'kuroshi_fox_receipts'] },
  { id: 'jwa_lib_a', name: 'Shelf: The Flame and the Line', books: ['jwaladesh_tejaswini', 'jwaladesh_flame_keepers', 'jwaladesh_agnivansh_line'] },
  { id: 'jwa_lib_b', name: 'Shelf: The Harbor and the Law', books: ['jwaladesh_harbor_chain', 'jwaladesh_law_flame', 'jwaladesh_relay'] },
  { id: 'jwa_lib_c', name: 'Shelf: The Bazaar Talks', books: ['jwaladesh_oil_ghee', 'jwaladesh_duels', 'jwaladesh_burned_temple'] },
  { id: 'jwa_treasury', name: 'The Treasury Book', books: ['jwaladesh_treasury_book'] },
  { id: 'jwa_court_records', name: "Shelf: The Court's Records", books: ['jwaladesh_priests_decision', 'jwaladesh_oil_contracts', 'jwaladesh_ledger_advances'] },
];

const BY_ID: ReadonlyMap<string, Book> = new Map(BOOKS.map((b) => [b.id, b]));

export function loreFlag(bookId: string): string {
  return `lore.${bookId}`;
}

export function shelfDialogueId(shelfId: string): string {
  return `shelf.${shelfId}`;
}

export function bookSpeakerId(bookId: string): string {
  return `book.${bookId}`;
}

/** Words in a text (for the 100 to 150 word rule). */
export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** The text cut into dialogue pages: whole sentences, packed up to MAX_PAGE_CHARS. */
export function bookPages(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+["']?\s*/g)?.map((s) => s.trim()) ?? [text];
  const pages: string[] = [];
  for (const s of sentences) {
    const last = pages[pages.length - 1];
    if (last !== undefined && last.length + 1 + s.length <= MAX_PAGE_CHARS) pages[pages.length - 1] = `${last} ${s}`;
    else pages.push(s);
  }
  return pages;
}

/**
 * A shelf as a dialogue: the list of its books (an unread title, or the same title marked read), and
 * Leave. Reading a book shows its pages under the book's title, marks it read and returns to the list.
 */
export function shelfScript(shelf: Shelf): DialogueScript {
  const choices: DialogueChoice[] = [];
  const nodes: DialogueScript['nodes'] = {};
  for (const id of shelf.books) {
    const book = BY_ID.get(id);
    if (!book) throw new Error(`Shelf ${shelf.id}: unknown book ${id}`);
    const flag = loreFlag(id);
    const here = (c: Condition): Condition => (book.available ? { all: [book.available, c] } : c);
    choices.push({ text: book.title, if: here({ notFlag: flag }), next: id });
    choices.push({ text: `${book.title} (read)`, if: here({ flag }), next: id });
    nodes[id] = {
      speaker: bookSpeakerId(id),
      set: { [flag]: true },
      lines: bookPages(book.text).map((text) => ({ text })),
      next: 'list',
    };
  }
  choices.push({ text: 'Leave' });
  nodes.list = { lines: [{ text: 'Which book?' }], choices };
  return { id: shelfDialogueId(shelf.id), start: 'list', nodes };
}

export const SHELF_DIALOGUE: Readonly<Record<string, DialogueScript>> = Object.fromEntries(
  SHELVES.map((s) => [shelfDialogueId(s.id), shelfScript(s)]),
);

/** Each book speaks under its own title, with the book portrait. */
export const BOOK_SPEAKERS: Readonly<Record<string, Speaker>> = Object.fromEntries(
  BOOKS.map((b) => [bookSpeakerId(b.id), { id: bookSpeakerId(b.id), name: b.title, portrait: 'book' }]),
);

export const SHELF_OBJECTS: Readonly<Record<string, ObjectInfo>> = Object.fromEntries(SHELVES.map((s) => [s.id, { name: s.name }]));

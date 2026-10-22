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

import { Level } from '../types';

export const AGGREGATION_MASTERY_LEVEL: Level = {
  id: 11,
  slug: 'aggregation-mastery',
  title: 'Aggregation Mastery',
  subtitle: 'Weak Has-A Bonds, Independent Lifecycles & Shared References',
  realmName: 'The Mercenary Guildhalls',
  iconName: 'Network',
  description:
    'Master Aggregation in Java OOP through 10 progressive challenges (Simple to Hard): external object injection, swappable references, shared objects across owners, 1-to-many collections, and multi-tier guild rosters.',
  topics: [
    'Weak Has-A Relationship (Independent Lifecycle)',
    'Constructor & Setter Reference Injection',
    'Swapping & Nullifying Aggregated Objects',
    'Shared Object References Across Multiple Owners',
    'One-to-Many & Multi-Tier Collection Aggregation',
  ],
  story:
    'In the Mercenary Guildhalls, heroes, mounts, and enchanted weapons forge alliances without losing their independent existence. If a guild disbands, its champions live on to join new banners.',
  totalXP: 1200,
  requiredLevelToUnlock: 11,
  prerequisiteLevelId: 10,
  bossChallenge: {
    title: 'Boss Challenge: The Grand Alliance Command',
    description:
      'Build an Alliance system that aggregates external Guild objects, where each Guild aggregates external Champion objects. Create Champion(String name, int power), Guild(String title) with addChampion(Champion c) and int getGuildPower(), and Alliance(String name) with addGuild(Guild g) and int getTotalAlliancePower(). In main(), create 2 Champions ("Arthur" 150, "Merlin" 200) in Guild "Avalon", and 1 Champion ("Lancelot" 180) in Guild "Camelot". Add both guilds to Alliance "Order of Light" and print total power.',
    tasks: [
      'Create class Champion with String name, int power, and constructor Champion(String name, int power)',
      'Create class Guild with String title and List<Champion> champions = new ArrayList<>()',
      'Implement void addChampion(Champion c) and int getGuildPower() in Guild',
      'Create class Alliance with String name and List<Guild> guilds = new ArrayList<>()',
      'Implement void addGuild(Guild g) and int getTotalAlliancePower() in Alliance',
      'In main(), instantiate the champions, guilds, and alliance, then print: "Alliance: " + alliance.name + " | Total Power: " + alliance.getTotalAlliancePower()',
    ],
    starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Build the Grand Alliance aggregation hierarchy here
        
    }
}

// Define Champion, Guild, and Alliance classes here
`,
    testCases: [
      {
        id: 'b11_agg_tc1',
        input: '',
        expectedOutput: 'Alliance: Order of Light | Total Power: 530',
        description: 'Validates multi-level aggregation across Champion, Guild, and Alliance',
      },
    ],
    hints: [
      'Each Champion is instantiated in main() and passed into guild.addChampion(c).',
      'In getTotalAlliancePower(), loop through guilds and sum g.getGuildPower().',
    ],
  },
  missions: [
    // 1. SIMPLE
    {
      id: 'm11_agg_1',
      levelId: 11,
      number: 1,
      title: 'Task 1 [Simple]: Basic Has-A Companion',
      mode: 'coding_arena',
      storyIntro: 'An externally tamed familiar joins a hero on their journey.',
      conceptSummary:
        'In Aggregation, the child object is created outside the parent class and passed in as a reference.',
      instructions:
        'Create class Pet with String name and constructor Pet(String name). Create class Hero with String name and Pet pet, and constructor Hero(String name, Pet pet). Implement void introduce() in Hero printing: name + " travels with " + pet.name. In main(), create Pet "Ignis", pass it to Hero "Astra", and call introduce().',
      tasks: [
        'Create class Pet with String name and constructor Pet(String name)',
        'Create class Hero with String name, Pet pet, and constructor Hero(String name, Pet pet)',
        'Implement void introduce() in Hero printing: name + " travels with " + pet.name',
        'In main(), create Pet("Ignis") and Hero("Astra", pet), then call hero.introduce()',
      ],
      xpReward: 80,
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Create Pet externally and pass it into Hero
        
    }
}

// Define Pet and Hero classes here
`,
      testCases: [
        {
          id: 'm11_agg_1_tc1',
          input: '',
          expectedOutput: 'Astra travels with Ignis',
          description: 'Validates basic constructor aggregation reference',
        },
      ],
      hints: ['Store the passed Pet reference in this.pet = pet; inside Hero constructor.'],
      explanation: 'Pet is instantiated independently in main() and aggregated into Hero.',
    },

    // 2. SIMPLE
    {
      id: 'm11_agg_2',
      levelId: 11,
      number: 2,
      title: 'Task 2 [Simple]: Swappable Weapon Loadout',
      mode: 'coding_arena',
      storyIntro: 'A warrior swaps weapons mid-battle without destroying the previous weapon.',
      conceptSummary:
        'Setter methods allow changing an aggregated object reference dynamically at runtime.',
      instructions:
        'Create class Weapon with String name, int atk, and constructor Weapon(String name, int atk). Create class Warrior with String name and Weapon weapon. Provide constructor Warrior(String name), void equip(Weapon w), and void showStatus() printing: name + " equips " + weapon.name + " (+" + weapon.atk + " ATK)". In main(), create Warrior "Kael", equip Weapon("Iron Blade", 15) and call showStatus(), then equip Weapon("Sunfire Sword", 45) and call showStatus().',
      tasks: [
        'Create class Weapon with String name, int atk, and constructor Weapon(String name, int atk)',
        'Create class Warrior with String name, Weapon weapon, and constructor Warrior(String name)',
        'Implement void equip(Weapon w) and void showStatus() in Warrior',
        'In main(), equip "Iron Blade" (15), call showStatus(), then equip "Sunfire Sword" (45) and call showStatus()',
      ],
      xpReward: 85,
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Test swapping aggregated Weapon objects on Warrior
        
    }
}

// Define Weapon and Warrior classes here
`,
      testCases: [
        {
          id: 'm11_agg_2_tc1',
          input: '',
          expectedOutput: 'Kael equips Iron Blade (+15 ATK)\nKael equips Sunfire Sword (+45 ATK)',
          description: 'Validates dynamic setter-based aggregation swapping',
        },
      ],
      hints: ['Call showStatus() after the first equip, then equip the second weapon and call showStatus() again.'],
      explanation: 'Because Warrior only holds a reference to Weapon, swapping the reference is instantaneous.',
    },

    // 3. SIMPLE
    {
      id: 'm11_agg_3',
      levelId: 11,
      number: 3,
      title: 'Task 3 [Simple]: Independent Object Survival',
      mode: 'coding_arena',
      storyIntro: 'Even when a mercenary leaves a contract, the mercenary continues to exist.',
      conceptSummary:
        'The hallmark of aggregation is that removing the parent reference does not destroy the child object.',
      instructions:
        'Create class Mercenary with String name, int rank, and constructor Mercenary(String name, int rank). Create class ContractPost with Mercenary assigned. Implement void assign(Mercenary m) and void release() (setting assigned = null). In main(), create Mercenary("Vane", 5), assign to post, print "Assigned: " + post.assigned.name, call post.release(), and prove Vane still exists by printing "Still alive: " + merc.name + " [Rank " + merc.rank + "]".',
      tasks: [
        'Create class Mercenary with String name, int rank, and constructor',
        'Create class ContractPost with Mercenary assigned, void assign(Mercenary m), and void release()',
        'In main(), assign Vane (rank 5) and print: "Assigned: " + post.assigned.name',
        'Call post.release() and print: "Still alive: " + merc.name + " [Rank " + merc.rank + "]"',
      ],
      xpReward: 90,
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Prove Mercenary survives after ContractPost releases the reference
        
    }
}

// Define Mercenary and ContractPost classes here
`,
      testCases: [
        {
          id: 'm11_agg_3_tc1',
          input: '',
          expectedOutput: 'Assigned: Vane\nStill alive: Vane [Rank 5]',
          description: 'Validates independent lifecycle of aggregated child instance',
        },
      ],
      hints: ['In release(), set this.assigned = null; while main() still holds the merc variable.'],
      explanation: 'Setting post.assigned = null only clears the field inside ContractPost; the Mercenary object remains alive via main\'s reference.',
    },

    // 4. MEDIUM
    {
      id: 'm11_agg_4',
      levelId: 11,
      number: 4,
      title: 'Task 4 [Medium]: Shared Reference Across Two Owners',
      mode: 'coding_arena',
      storyIntro: 'Two arcane scholars share the exact same ancient codex.',
      conceptSummary:
        'In aggregation, multiple parent objects can hold references to the exact same child object in heap memory.',
      instructions:
        'Create class Codex with String title, int spells, and constructor Codex(String title, int spells). Create class Scholar with String name, Codex codex, and constructor Scholar(String name, Codex codex). Implement void addSpell() in Scholar that increments codex.spells by 1, and void printInfo() printing: name + " reads " + codex.title + " (" + codex.spells + " spells)". In main(), create one Codex("Grimoire", 10), pass it to both Scholar("Lyra", codex) and Scholar("Orion", codex). Call lyra.addSpell(), then call printInfo() on both Lyra and Orion.',
      tasks: [
        'Create class Codex with String title, int spells, and constructor',
        'Create class Scholar with String name, Codex codex, constructor, void addSpell(), and void printInfo()',
        'In main(), share a single Codex("Grimoire", 10) between Lyra and Orion',
        'Call lyra.addSpell(), then call lyra.printInfo() and orion.printInfo()',
      ],
      xpReward: 100,
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Share a single Codex instance between two Scholar instances
        
    }
}

// Define Codex and Scholar classes here
`,
      testCases: [
        {
          id: 'm11_agg_4_tc1',
          input: '',
          expectedOutput: 'Lyra reads Grimoire (11 spells)\nOrion reads Grimoire (11 spells)',
          description: 'Validates shared object reference mutation across two aggregating owners',
        },
      ],
      hints: ['Pass the exact same codex variable to both Scholar constructors.'],
      explanation: 'Both scholars point to the same Codex object in heap memory, so incrementing spells via Lyra is visible to Orion.',
    },

    // 5. MEDIUM
    {
      id: 'm11_agg_5',
      levelId: 11,
      number: 5,
      title: 'Task 5 [Medium]: Null-Safe Optional Aggregation',
      mode: 'coding_arena',
      storyIntro: 'A paladin can march on foot or ride a celestial steed.',
      conceptSummary:
        'Because aggregated objects are optional, methods should safely check for null before dereferencing.',
      instructions:
        'Create class Mount with String name, int bonusSpeed, and constructor Mount(String name, int bonusSpeed). Create class Paladin with String name, int baseSpeed, and Mount mount. Provide constructor Paladin(String name, int baseSpeed), void setMount(Mount m), and int getTotalSpeed() returning baseSpeed if mount == null, else baseSpeed + mount.bonusSpeed. Provide void printStatus() printing: name + " Speed: " + getTotalSpeed(). In main(), create Paladin("Galahad", 20), call printStatus(), then setMount(new Mount("Pegasus", 35)) and call printStatus().',
      tasks: [
        'Create class Mount with String name, int bonusSpeed, and constructor',
        'Create class Paladin with String name, int baseSpeed, Mount mount, and constructor Paladin(String name, int baseSpeed)',
        'Implement void setMount(Mount m), int getTotalSpeed(), and void printStatus()',
        'In main(), print status before and after mounting Pegasus (35)',
      ],
      xpReward: 105,
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Test Paladin speed with null Mount and with Pegasus Mount
        
    }
}

// Define Mount and Paladin classes here
`,
      testCases: [
        {
          id: 'm11_agg_5_tc1',
          input: '',
          expectedOutput: 'Galahad Speed: 20\nGalahad Speed: 55',
          description: 'Validates null-safe handling of uninitialized aggregated field',
        },
      ],
      hints: ['In getTotalSpeed(), check: if (mount == null) return baseSpeed; return baseSpeed + mount.bonusSpeed;'],
      explanation: 'Defensive null checks prevent NullPointerExceptions when an aggregated partner is not yet attached.',
    },

    // 6. MEDIUM
    {
      id: 'm11_agg_6',
      levelId: 11,
      number: 6,
      title: 'Task 6 [Medium]: One-to-Many Party Roster',
      mode: 'coding_arena',
      storyIntro: 'Form a raiding party by aggregating multiple heroes into an ArrayList.',
      conceptSummary:
        'One-to-many aggregation is typically modeled using a List<T> collection of externally created objects.',
      instructions:
        'Create class Adventurer with String name, int level, and constructor Adventurer(String name, int level). Create class Party with String partyName and List<Adventurer> members = new ArrayList<>(). Provide constructor Party(String partyName), void addMember(Adventurer a), and void printSummary() printing: partyName + " | Members: " + members.size() + " | Total Lv: " + totalLevels. In main(), create Party "Starlight", add 3 adventurers ("Aria" 10, "Bram" 12, "Cora" 15), and call printSummary().',
      tasks: [
        'Create class Adventurer with String name, int level, and constructor',
        'Create class Party with String partyName and List<Adventurer> members = new ArrayList<>()',
        'Implement void addMember(Adventurer a) and void printSummary() summing member levels',
        'In main(), add Aria (10), Bram (12), and Cora (15) to Party "Starlight" and call printSummary()',
      ],
      xpReward: 110,
      starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Aggregate 3 Adventurer instances into Party
        
    }
}

// Define Adventurer and Party classes here
`,
      testCases: [
        {
          id: 'm11_agg_6_tc1',
          input: '',
          expectedOutput: 'Starlight | Members: 3 | Total Lv: 37',
          description: 'Validates 1-to-many List aggregation and state summation',
        },
      ],
      hints: ['Loop through members with for (Adventurer a : members) to sum a.level.'],
      explanation: 'A collection of object references allows a parent entity to aggregate any number of independent objects.',
    },

    // 7. MEDIUM
    {
      id: 'm11_agg_7',
      levelId: 11,
      number: 7,
      title: 'Task 7 [Medium]: Transferring Aggregated Ships Between Fleets',
      mode: 'coding_arena',
      storyIntro: 'Reassign a sky-galleon from the Northern Fleet to the Southern Vanguard.',
      conceptSummary:
        'Aggregated objects can be removed from one container and added to another without recreating the object.',
      instructions:
        'Create class Airship with String name and constructor Airship(String name). Create class Fleet with String name, List<Airship> ships = new ArrayList<>(), constructor Fleet(String name), void addShip(Airship s), void removeShip(Airship s), and void printCount() printing: name + " ships: " + ships.size(). In main(), create Airship s1 = new Airship("Valkyrie") and s2 = new Airship("Hyperion"). Add both to Fleet "North", create Fleet "South", then remove s1 from "North" and add s1 to "South". Call printCount() on North and South.',
      tasks: [
        'Create class Airship with String name and constructor',
        'Create class Fleet with String name, List<Airship> ships, addShip, removeShip, and printCount',
        'In main(), add Valkyrie and Hyperion to Fleet "North"',
        'Transfer Valkyrie from "North" to "South", then call north.printCount() and south.printCount()',
      ],
      xpReward: 115,
      starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Transfer an Airship instance from North fleet to South fleet
        
    }
}

// Define Airship and Fleet classes here
`,
      testCases: [
        {
          id: 'm11_agg_7_tc1',
          input: '',
          expectedOutput: 'North ships: 1\nSouth ships: 1',
          description: 'Validates object transfer between two aggregating collections',
        },
      ],
      hints: ['Use ships.remove(s); inside removeShip(Airship s).'],
      explanation: 'Transferring references moves ownership between collections while preserving the underlying object identity.',
    },

    // 8. HARD
    {
      id: 'm11_agg_8',
      levelId: 11,
      number: 8,
      title: 'Task 8 [Hard]: Filtering & Searching Aggregated Artifacts',
      mode: 'coding_arena',
      storyIntro: 'The Royal Vault curator searches aggregated relics by element and power threshold.',
      conceptSummary:
        'Aggregating classes often provide query methods that filter and aggregate metrics across their held references.',
      instructions:
        'Create class Artifact with String name, String element, int power, and constructor Artifact(String name, String element, int power). Create class Vault with List<Artifact> items = new ArrayList<>(), void store(Artifact a), and int getElementPower(String targetElement) which sums power of only artifacts whose element.equals(targetElement). In main(), store ("Sunstone", "Fire", 80), ("FrostOrb", "Ice", 60), and ("FlameCrown", "Fire", 120). Print "Fire Power: " + vault.getElementPower("Fire") and "Ice Power: " + vault.getElementPower("Ice").',
      tasks: [
        'Create class Artifact with String name, String element, int power, and constructor',
        'Create class Vault with List<Artifact> items, void store(Artifact a), and int getElementPower(String targetElement)',
        'In getElementPower, sum power of items where item.element.equals(targetElement)',
        'In main(), store the 3 artifacts and print Fire Power and Ice Power',
      ],
      xpReward: 125,
      starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Store artifacts and query aggregated power by element
        
    }
}

// Define Artifact and Vault classes here
`,
      testCases: [
        {
          id: 'm11_agg_8_tc1',
          input: '',
          expectedOutput: 'Fire Power: 200\nIce Power: 60',
          description: 'Validates filtered aggregation queries over object collections',
        },
      ],
      hints: ['Use a.element.equals(targetElement) inside a for-each loop to filter matching artifacts.'],
      explanation: 'Domain services query aggregated collections without mutating the underlying entities.',
    },

    // 9. HARD
    {
      id: 'm11_agg_9',
      levelId: 11,
      number: 9,
      title: 'Task 9 [Hard]: Capacity-Bounded Squad Aggregation',
      mode: 'coding_arena',
      storyIntro: 'A tactical strike squad enforces strict capacity rules when recruiting external operatives.',
      conceptSummary:
        'Aggregating containers can enforce domain invariants such as capacity limits and minimum level requirements.',
      instructions:
        'Create class Operative with String codeName, int clearance, and constructor Operative(String codeName, int clearance). Create class StrikeSquad with int maxCapacity, List<Operative> roster = new ArrayList<>(), and constructor StrikeSquad(int maxCapacity). Implement boolean recruit(Operative op) that only adds op and returns true if roster.size() < maxCapacity AND op.clearance >= 3; otherwise returns false. In main(), create StrikeSquad(2), attempt to recruit ("Ghost", 5), ("Rookie", 1), ("Viper", 4), and ("Hawk", 5). Print each recruit result as "Recruited [name]: [true/false]", then print "Final Roster: " + squad.roster.size().',
      tasks: [
        'Create class Operative with String codeName, int clearance, and constructor',
        'Create class StrikeSquad with int maxCapacity, List<Operative> roster, and constructor StrikeSquad(int maxCapacity)',
        'Implement boolean recruit(Operative op) checking roster.size() < maxCapacity && op.clearance >= 3',
        'In main(), test recruiting Ghost(5), Rookie(1), Viper(4), Hawk(5) into StrikeSquad(2) and print results',
      ],
      xpReward: 135,
      starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Test invariant-guarded aggregation recruitment
        
    }
}

// Define Operative and StrikeSquad classes here
`,
      testCases: [
        {
          id: 'm11_agg_9_tc1',
          input: '',
          expectedOutput: 'Recruited Ghost: true\nRecruited Rookie: false\nRecruited Viper: true\nRecruited Hawk: false\nFinal Roster: 2',
          description: 'Validates capacity and clearance invariants during aggregation',
        },
      ],
      hints: ['Check if (roster.size() < maxCapacity && op.clearance >= 3) before adding to roster.'],
      explanation: 'Guarded aggregation ensures invalid or excess entities cannot corrupt the container state.',
    },

    // 10. HARD
    {
      id: 'm11_agg_10',
      levelId: 11,
      number: 10,
      title: 'Task 10 [Hard]: Multi-Tier Kingdom Regiment Aggregation',
      mode: 'coding_arena',
      storyIntro: 'Command a 3-tier military hierarchy where soldiers join regiments and regiments join the kingdom.',
      conceptSummary:
        'Complex enterprise models chain multiple aggregation layers while keeping leaf entities independent.',
      instructions:
        'Create class Knight with String name, int atk, and constructor Knight(String name, int atk). Create class Regiment with String regimentName, List<Knight> knights = new ArrayList<>(), constructor Regiment(String regimentName), void addKnight(Knight k), and int getRegimentAtk() summing knights\' atk. Create class Army with List<Regiment> regiments = new ArrayList<>(), void addRegiment(Regiment r), and void printArmyReport() printing each regiment\'s name and atk, followed by "Total Army ATK: " + sum. In main(), create Regiment "Vanguard" with Knights ("Roland" 50, "Gawain" 70) and Regiment "Archers" with Knight ("Robin" 65). Add both regiments to Army and call printArmyReport().',
      tasks: [
        'Create class Knight with String name, int atk, and constructor',
        'Create class Regiment with String regimentName, List<Knight> knights, addKnight, and int getRegimentAtk()',
        'Create class Army with List<Regiment> regiments, addRegiment, and void printArmyReport()',
        'In printArmyReport(), print each regiment as: r.regimentName + ": " + r.getRegimentAtk() and finally "Total Army ATK: " + total',
      ],
      xpReward: 150,
      starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Build the 3-tier Knight -> Regiment -> Army aggregation hierarchy
        
    }
}

// Define Knight, Regiment, and Army classes here
`,
      testCases: [
        {
          id: 'm11_agg_10_tc1',
          input: '',
          expectedOutput: 'Vanguard: 120\nArchers: 65\nTotal Army ATK: 185',
          description: 'Validates 3-tier hierarchical aggregation and rollup reporting',
        },
      ],
      hints: ['In printArmyReport(), loop over regiments, print r.regimentName + ": " + r.getRegimentAtk(), and accumulate total.'],
      explanation: 'Hierarchical aggregation scales cleanly from individual units to entire armies.',
    },
  ],
};

export const COMPOSITION_MASTERY_LEVEL: Level = {
  id: 12,
  slug: 'composition-mastery',
  title: 'Composition Mastery',
  subtitle: 'Strong Part-Of Ownership, Exclusive Lifecycles & Internal Construction',
  realmName: 'The Clockwork Sanctum',
  iconName: 'Shield',
  description:
    'Master Composition in Java OOP through 10 progressive challenges (Simple to Hard): internal constructor instantiation, exclusive component ownership, multi-component systems, defensive copying, and deep composite hierarchies.',
  topics: [
    'Strong Part-Of Relationship (Shared Lifecycle)',
    'Internal Instantiation Inside Constructors',
    'Component Encapsulation & Delegation',
    'Defensive Copying to Prevent Reference Leaks',
    'Multi-Level Composite Architectures',
  ],
  story:
    'Within the Clockwork Sanctum, arcane automatons and fortresses are forged with inseparable internal cores. When a construct is born, its heart is forged within it; when it falls, its core ceases to exist.',
  totalXP: 1300,
  requiredLevelToUnlock: 12,
  prerequisiteLevelId: 11,
  bossChallenge: {
    title: 'Boss Challenge: The Dreadnought Citadel Engine',
    description:
      'Architect a Dreadnought war-construct using strict Composition. Dreadnought internally constructs a ShieldCore(int shieldHp) and a HullCore(int hullHp) inside its constructor Dreadnought(String name, int shieldHp, int hullHp). Implement void takeHit(int dmg): damage is absorbed by ShieldCore first; any leftover damage reduces HullCore (minimum 0). Implement void printTelemetry() printing: name + " [Shield: " + shield.hp + ", Hull: " + hull.hp + "]". In main(), create Dreadnought("Hyperion", 100, 250), call takeHit(60), printTelemetry(), call takeHit(90), and printTelemetry().',
    tasks: [
      'Create class ShieldCore with int hp and constructor ShieldCore(int hp)',
      'Create class HullCore with int hp and constructor HullCore(int hp)',
      'Create class Dreadnought with String name, private ShieldCore shield, and private HullCore hull instantiated inside Dreadnought constructor',
      'Implement void takeHit(int dmg) routing damage to shield first and overflow to hull',
      'Implement void printTelemetry() printing: name + " [Shield: " + shield.hp + ", Hull: " + hull.hp + "]"',
      'In main(), test Hyperion(100, 250) with takeHit(60) and takeHit(90), printing telemetry after each hit',
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        // Test the composite Dreadnought war-construct
        
    }
}

// Define ShieldCore, HullCore, and Dreadnought classes here
`,
    testCases: [
      {
        id: 'b12_comp_tc1',
        input: '',
        expectedOutput: 'Hyperion [Shield: 40, Hull: 250]\nHyperion [Shield: 0, Hull: 200]',
        description: 'Validates multi-component composition and cascading state logic',
      },
    ],
    hints: [
      'If dmg <= shield.hp, subtract dmg from shield.hp. Else, int overflow = dmg - shield.hp; shield.hp = 0; hull.hp -= overflow;',
    ],
  },
  missions: [
    // 1. SIMPLE
    {
      id: 'm12_comp_1',
      levelId: 12,
      number: 1,
      title: 'Task 1 [Simple]: The Heart of the Automaton',
      mode: 'coding_arena',
      storyIntro: 'Forge a mechanical guardian whose power core is created inside its own constructor.',
      conceptSummary:
        'In Composition, the parent class is responsible for instantiating its own component using new inside the constructor.',
      instructions:
        'Create class PowerCore with int watts and constructor PowerCore(int watts). Create class Automaton with String model and private PowerCore core. Inside constructor Automaton(String model, int watts), instantiate this.core = new PowerCore(watts). Provide void report() printing: model + " powered by " + core.watts + "W core". In main(), create Automaton("Titan-X", 500) and call report().',
      tasks: [
        'Create class PowerCore with int watts and constructor PowerCore(int watts)',
        'Create class Automaton with String model and private PowerCore core',
        'Inside Automaton(String model, int watts), instantiate this.core = new PowerCore(watts)',
        'Implement void report() and test with Automaton("Titan-X", 500) in main()',
      ],
      xpReward: 85,
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Instantiate Automaton which internally creates its PowerCore
        
    }
}

// Define PowerCore and Automaton classes here
`,
      testCases: [
        {
          id: 'm12_comp_1_tc1',
          input: '',
          expectedOutput: 'Titan-X powered by 500W core',
          description: 'Validates internal component creation in constructor',
        },
      ],
      hints: ['Do not pass PowerCore from main(); pass int watts and let Automaton call new PowerCore(watts).'],
      explanation: 'Because PowerCore is instantiated exclusively inside Automaton, no external code holds a direct reference to it.',
    },

    // 2. SIMPLE
    {
      id: 'm12_comp_2',
      levelId: 12,
      number: 2,
      title: 'Task 2 [Simple]: Castle & Inner Sanctum',
      mode: 'coding_arena',
      storyIntro: 'Every royal fortress is constructed together with its throne room.',
      conceptSummary:
        'A composed part cannot exist without its owning whole.',
      instructions:
        'Create class ThroneRoom with String banner and constructor ThroneRoom(String banner). Create class Castle with String castleName and private ThroneRoom room. In Castle(String castleName, String banner), instantiate room = new ThroneRoom(banner). Implement void describe() printing: "Castle " + castleName + " houses the " + room.banner + " Throne". In main(), create Castle("Drakenhold", "Crimson Dragon") and call describe().',
      tasks: [
        'Create class ThroneRoom with String banner and constructor',
        'Create class Castle with String castleName and private ThroneRoom room created in Castle constructor',
        'Implement void describe() printing: "Castle " + castleName + " houses the " + room.banner + " Throne"',
        'In main(), instantiate Castle("Drakenhold", "Crimson Dragon") and call describe()',
      ],
      xpReward: 90,
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Construct Castle and describe its composed ThroneRoom
        
    }
}

// Define ThroneRoom and Castle classes here
`,
      testCases: [
        {
          id: 'm12_comp_2_tc1',
          input: '',
          expectedOutput: 'Castle Drakenhold houses the Crimson Dragon Throne',
          description: 'Validates strict part-of composition construction',
        },
      ],
      hints: ['Inside Castle constructor: this.room = new ThroneRoom(banner);'],
      explanation: 'ThroneRoom is strictly bound to Castle\'s lifecycle.',
    },

    // 3. SIMPLE
    {
      id: 'm12_comp_3',
      levelId: 12,
      number: 3,
      title: 'Task 3 [Simple]: Multi-Part Blade Assembly',
      mode: 'coding_arena',
      storyIntro: 'A master smith forges a legendary sword from an inseparable blade and hilt.',
      conceptSummary:
        'A composite parent can own multiple distinct internal component objects simultaneously.',
      instructions:
        'Create class Blade with String metal and constructor Blade(String metal). Create class Hilt with String gem and constructor Hilt(String gem). Create class LegendarySword with private Blade blade and private Hilt hilt. In LegendarySword(String metal, String gem), instantiate both components internally. Implement void inspect() printing: "Sword[Blade: " + blade.metal + ", Hilt: " + hilt.gem + "]". In main(), create LegendarySword("Mythril", "Sapphire") and call inspect().',
      tasks: [
        'Create class Blade(String metal) and class Hilt(String gem)',
        'Create class LegendarySword composing private Blade blade and private Hilt hilt',
        'Implement void inspect() printing: "Sword[Blade: " + blade.metal + ", Hilt: " + hilt.gem + "]"',
        'In main(), test with ("Mythril", "Sapphire")',
      ],
      xpReward: 95,
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Forge LegendarySword with internal Blade and Hilt components
        
    }
}

// Define Blade, Hilt, and LegendarySword classes here
`,
      testCases: [
        {
          id: 'm12_comp_3_tc1',
          input: '',
          expectedOutput: 'Sword[Blade: Mythril, Hilt: Sapphire]',
          description: 'Validates multi-component composition in a single owner',
        },
      ],
      hints: ['Instantiate both new Blade(metal) and new Hilt(gem) inside the LegendarySword constructor.'],
      explanation: 'Composite objects coordinate multiple smaller parts as a unified whole.',
    },

    // 4. MEDIUM
    {
      id: 'm12_comp_4',
      levelId: 12,
      number: 4,
      title: 'Task 4 [Medium]: Delegating Behavior to Internal Component',
      mode: 'coding_arena',
      storyIntro: 'A mage tower channels energy by delegating commands to its hidden mana reactor.',
      conceptSummary:
        'In composition, the parent hides the internal component and exposes clean delegating methods.',
      instructions:
        'Create class ManaReactor with int charge = 100, void amplify(int amount) adding amount to charge, and int getCharge(). Create class MageTower with String name and private ManaReactor reactor = new ManaReactor(). Implement void overcharge(int bonus) in MageTower that delegates to reactor.amplify(bonus * 2), and void printPower() printing: name + " Reactor Charge: " + reactor.getCharge(). In main(), create MageTower("Astral Spire"), call overcharge(25), and call printPower().',
      tasks: [
        'Create class ManaReactor with int charge = 100, void amplify(int amount), and int getCharge()',
        'Create class MageTower with String name, private ManaReactor reactor = new ManaReactor(), and constructor MageTower(String name)',
        'Implement void overcharge(int bonus) calling reactor.amplify(bonus * 2) and void printPower()',
        'In main(), create MageTower("Astral Spire"), call overcharge(25), and call printPower()',
      ],
      xpReward: 105,
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Test behavior delegation to composed ManaReactor
        
    }
}

// Define ManaReactor and MageTower classes here
`,
      testCases: [
        {
          id: 'm12_comp_4_tc1',
          input: '',
          expectedOutput: 'Astral Spire Reactor Charge: 150',
          description: 'Validates method forwarding to a private composed component',
        },
      ],
      hints: ['overcharge(25) should pass 25 * 2 = 50 to reactor.amplify(50).'],
      explanation: 'Delegation keeps the internal component completely hidden while exposing high-level behaviors.',
    },

    // 5. MEDIUM
    {
      id: 'm12_comp_5',
      levelId: 12,
      number: 5,
      title: 'Task 5 [Medium]: Overloaded Composite Constructors',
      mode: 'coding_arena',
      storyIntro: 'Construct standard or custom-tuned cybernetic armor suits.',
      conceptSummary:
        'Overloaded constructors in a composite class can configure internal components with default or custom parameters.',
      instructions:
        'Create class ExoFrame with String alloy, int rating, and constructor ExoFrame(String alloy, int rating). Create class CyberSuit with String pilot and private ExoFrame frame. Provide two constructors: (1) CyberSuit(String pilot) which creates new ExoFrame("Steel", 100); and (2) CyberSuit(String pilot, String alloy, int rating) which creates new ExoFrame(alloy, rating). Implement void printSpec() printing: pilot + " -> " + frame.alloy + " [" + frame.rating + "]". In main(), create s1 with ("Rex") and s2 with ("Nova", "Vibranium", 350), and call printSpec() on both.',
      tasks: [
        'Create class ExoFrame with String alloy, int rating, and constructor',
        'Create class CyberSuit with overloaded constructors creating default or custom ExoFrame internally',
        'Implement void printSpec() printing: pilot + " -> " + frame.alloy + " [" + frame.rating + "]"',
        'In main(), instantiate both suits and call printSpec() on each',
      ],
      xpReward: 110,
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Test default and custom composite CyberSuit constructors
        
    }
}

// Define ExoFrame and CyberSuit classes here
`,
      testCases: [
        {
          id: 'm12_comp_5_tc1',
          input: '',
          expectedOutput: 'Rex -> Steel [100]\nNova -> Vibranium [350]',
          description: 'Validates constructor overloading with internal component instantiation',
        },
      ],
      hints: ['You can chain this(pilot, "Steel", 100); in the single-argument constructor.'],
      explanation: 'Combining constructor chaining with composition centralizes component creation.',
    },

    // 6. MEDIUM
    {
      id: 'm12_comp_6',
      levelId: 12,
      number: 6,
      title: 'Task 6 [Medium]: Composed Collection of Dungeon Rooms',
      mode: 'coding_arena',
      storyIntro: 'A dungeon architect carves chambers that exist solely inside the dungeon.',
      conceptSummary:
        'In 1-to-many Composition, the parent class instantiates the child elements itself (e.g., addRoom(String name, int level)) rather than accepting pre-built external objects.',
      instructions:
        'Create class Chamber with String title, int danger, and constructor Chamber(String title, int danger). Create class Dungeon with String name and private List<Chamber> chambers = new ArrayList<>(). Provide constructor Dungeon(String name), void carveChamber(String title, int danger) which instantiates new Chamber(title, danger) and adds it to chambers, and void printDungeon() printing: name + " (" + chambers.size() + " chambers, Total Danger: " + totalDanger + ")". In main(), create Dungeon("Shadow Crypt"), carve ("Entry Hall", 10) and ("Boss Lair", 90), and call printDungeon().',
      tasks: [
        'Create class Chamber with String title, int danger, and constructor',
        'Create class Dungeon with String name and private List<Chamber> chambers = new ArrayList<>()',
        'Implement void carveChamber(String title, int danger) creating new Chamber(title, danger) internally',
        'Implement void printDungeon() and test in main()',
      ],
      xpReward: 115,
      starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Carve internal chambers inside Dungeon
        
    }
}

// Define Chamber and Dungeon classes here
`,
      testCases: [
        {
          id: 'm12_comp_6_tc1',
          input: '',
          expectedOutput: 'Shadow Crypt (2 chambers, Total Danger: 100)',
          description: 'Validates 1-to-many composition where parent instantiates collection items',
        },
      ],
      hints: ['Notice carveChamber takes (String title, int danger), NOT a Chamber object!'],
      explanation: 'Passing raw data so the parent constructs the child guarantees no external code holds a reference to the Chamber.',
    },

    // 7. MEDIUM
    {
      id: 'm12_comp_7',
      levelId: 12,
      number: 7,
      title: 'Task 7 [Medium]: Defensive Copying to Preserve Composition',
      mode: 'coding_arena',
      storyIntro: 'Prevent external spies from mutating a vault\'s internal cipher key.',
      conceptSummary:
        'If a composite class accepts or returns a mutable object, it must make a defensive copy (clone) so external code cannot mutate internal state.',
      instructions:
        'Create class CipherKey with int code and constructor CipherKey(int code). Create class RoyalVault with private CipherKey key. In constructor RoyalVault(CipherKey externalKey), make a defensive copy: this.key = new CipherKey(externalKey.code). In main(), create CipherKey ext = new CipherKey(7777), pass ext to RoyalVault vault = new RoyalVault(ext), then mutate ext.code = 0000. Print "External code: " + ext.code and "Vault internal code: " + vault.getVaultCode() (where getVaultCode() returns key.code).',
      tasks: [
        'Create class CipherKey with int code and constructor CipherKey(int code)',
        'Create class RoyalVault with private CipherKey key',
        'In RoyalVault(CipherKey externalKey), copy the key: this.key = new CipherKey(externalKey.code)',
        'Implement int getVaultCode() returning key.code',
        'In main(), mutate ext.code = 0 and verify vault internal code remains 7777',
      ],
      xpReward: 120,
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Prove defensive copying protects RoyalVault from external mutation
        
    }
}

// Define CipherKey and RoyalVault classes here
`,
      testCases: [
        {
          id: 'm12_comp_7_tc1',
          input: '',
          expectedOutput: 'External code: 0\nVault internal code: 7777',
          description: 'Validates defensive copying in constructor to enforce composition isolation',
        },
      ],
      hints: ['Create a brand new CipherKey(externalKey.code) inside the RoyalVault constructor.'],
      explanation: 'Defensive copying turns a potentially shared reference into an exclusively owned internal component.',
    },

    // 8. HARD
    {
      id: 'm12_comp_8',
      levelId: 12,
      number: 8,
      title: 'Task 8 [Hard]: Multi-Component Alchemy Pipeline',
      mode: 'coding_arena',
      storyIntro: 'Coordinate an internal furnace and condenser to brew high-potency elixirs.',
      conceptSummary:
        'Composite controllers orchestrate workflows across multiple internal subsystems.',
      instructions:
        'Create class Furnace with int heatMultiplier and constructor Furnace(int heatMultiplier), and int heatHerb(int basePotency) returning basePotency * heatMultiplier. Create class Condenser with int purityBonus and constructor Condenser(int purityBonus), and int refine(int heatedPotency) returning heatedPotency + purityBonus. Create class AlchemyStation with private Furnace furnace and private Condenser condenser instantiated in constructor AlchemyStation(int heatMult, int purityBonus). Implement void brew(String potionName, int basePotency) printing: potionName + " Final Potency: " + condenser.refine(furnace.heatHerb(basePotency)). In main(), create AlchemyStation(3, 20) and brew("Phoenix Elixir", 40).',
      tasks: [
        'Create class Furnace(int heatMultiplier) with int heatHerb(int basePotency)',
        'Create class Condenser(int purityBonus) with int refine(int heatedPotency)',
        'Create class AlchemyStation composing Furnace and Condenser internally',
        'Implement void brew(String potionName, int basePotency) and test with (3, 20) and ("Phoenix Elixir", 40)',
      ],
      xpReward: 130,
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Orchestrate Furnace and Condenser inside AlchemyStation
        
    }
}

// Define Furnace, Condenser, and AlchemyStation classes here
`,
      testCases: [
        {
          id: 'm12_comp_8_tc1',
          input: '',
          expectedOutput: 'Phoenix Elixir Final Potency: 140',
          description: 'Validates multi-component pipeline coordination in a composite class',
        },
      ],
      hints: ['40 * 3 = 120 from Furnace, then 120 + 20 = 140 from Condenser.'],
      explanation: 'Complex machines decompose work across specialized internal components.',
    },

    // 9. HARD
    {
      id: 'm12_comp_9',
      levelId: 12,
      number: 9,
      title: 'Task 9 [Hard]: 3-Layer Nested Composition Chain',
      mode: 'coding_arena',
      storyIntro: 'An astral battleship contains an engine bay, which itself contains a singularity core.',
      conceptSummary:
        'Composition can be nested across multiple levels (Whole -> Subsystem -> Sub-component).',
      instructions:
        'Create class SingularityCore with intwarpFactor and constructor SingularityCore(int warpFactor), and int getThrust() returning warpFactor * 100. Create class EngineBay with private SingularityCore core instantiated inside constructor EngineBay(int warpFactor), and int getBayThrust() returning core.getThrust() + 50. Create class AstralShip with String shipName and private EngineBay bay instantiated inside constructor AstralShip(String shipName, int warpFactor). Implement void launch() printing: shipName + " launching at " + bay.getBayThrust() + " thrust!". In main(), create AstralShip("Celestia", 8) and call launch().',
      tasks: [
        'Create class SingularityCore(int warpFactor) with int getThrust() returning warpFactor * 100',
        'Create class EngineBay(int warpFactor) composing SingularityCore and implementing int getBayThrust()',
        'Create class AstralShip(String shipName, int warpFactor) composing EngineBay and implementing void launch()',
        'In main(), create AstralShip("Celestia", 8) and call launch()',
      ],
      xpReward: 140,
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Build the 3-layer nested composition chain: AstralShip -> EngineBay -> SingularityCore
        
    }
}

// Define SingularityCore, EngineBay, and AstralShip classes here
`,
      testCases: [
        {
          id: 'm12_comp_9_tc1',
          input: '',
          expectedOutput: 'Celestia launching at 850 thrust!',
          description: 'Validates 3-level nested composition construction and delegation',
        },
      ],
      hints: ['AstralShip creates EngineBay(warpFactor), and EngineBay creates SingularityCore(warpFactor).'],
      explanation: 'Nested composition encapsulates deep subsystem hierarchies behind a simple top-level interface.',
    },

    // 10. HARD
    {
      id: 'm12_comp_10',
      levelId: 12,
      number: 10,
      title: 'Task 10 [Hard]: Hybrid Composition & Aggregation Fortress',
      mode: 'coding_arena',
      storyIntro: 'Architect a sky-fortress that owns an inseparable shield generator (composition) while hosting visiting guardians (aggregation).',
      conceptSummary:
        'Real-world architectures combine Composition for permanent core subsystems and Aggregation for swappable external participants.',
      instructions:
        'Create class AegisCore with int baseDefense and constructor AegisCore(int baseDefense). Create class Guardian with String name, int might, and constructor Guardian(String name, int might). Create class SkyFortress with String name, private AegisCore core (instantiated inside SkyFortress(String name, int coreDefense)), and List<Guardian> guardians = new ArrayList<>() (added externally via void stationGuardian(Guardian g)). Implement void printFortressRating() summing core.baseDefense + all guardians\' might and printing: name + " | Core: " + core.baseDefense + " | Guardians: " + guardians.size() + " | Total Defense: " + total. In main(), create SkyFortress("Aethelgard", 500), station Guardian("Valen", 120) and Guardian("Sera", 130), and call printFortressRating().',
      tasks: [
        'Create class AegisCore(int baseDefense) and class Guardian(String name, int might)',
        'Create class SkyFortress composing private AegisCore core internally and aggregating List<Guardian> guardians externally',
        'Implement void stationGuardian(Guardian g) and void printFortressRating()',
        'In main(), create SkyFortress("Aethelgard", 500), station Valen(120) and Sera(130), and call printFortressRating()',
      ],
      xpReward: 155,
      starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Combine Composition (AegisCore) and Aggregation (Guardians) in SkyFortress
        
    }
}

// Define AegisCore, Guardian, and SkyFortress classes here
`,
      testCases: [
        {
          id: 'm12_comp_10_tc1',
          input: '',
          expectedOutput: 'Aethelgard | Core: 500 | Guardians: 2 | Total Defense: 750',
          description: 'Validates hybrid composition + aggregation architecture',
        },
      ],
      hints: ['Instantiate new AegisCore(coreDefense) inside SkyFortress constructor, and add Guardian objects via stationGuardian(Guardian g).'],
      explanation: 'Mastering when to use Composition (AegisCore) vs Aggregation (Guardian) is the pinnacle of object relationship design.',
    },
  ],
};

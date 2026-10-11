import { Level } from '../types';
import {
  CONSTRUCTOR_OVERLOADING_LEVEL,
  METHOD_OVERLOADING_LEVEL,
  METHOD_OVERRIDING_LEVEL,
} from './masteryLevels';
import {
  AGGREGATION_MASTERY_LEVEL,
  COMPOSITION_MASTERY_LEVEL,
} from './relationshipMasteryLevels';
import { ETERNAL_KINGDOM_CAPSTONES } from './eternalKingdomCapstones';

export const CURRICULUM: Level[] = [
  // =========================================================================
  // LEVEL 01: CLASS FOREST
  // =========================================================================
  {
    id: 1,
    slug: 'class-forest',
    title: 'Class Forest',
    subtitle: 'The Awakening of Blueprints & Instances',
    realmName: 'The Emerald Canopy',
    iconName: 'Trees',
    description: 'Master classes and objects, instance variables, methods, and instantiation with the new keyword.',
    topics: [
      'Classes & Objects',
      'Instance Variables',
      'Methods & Behavior',
      'The new Keyword',
      'Independent Object State',
    ],
    story: 'You awaken in an ancient forest where ethereal characters lie dormant as uninstantiated blueprints. To survive and awaken your companion, you must learn to sculpt classes and bring them to life in memory.',
    totalXP: 550,
    requiredLevelToUnlock: 1,
    bossChallenge: {
      title: 'Defeat the Forest Guardian',
      description: 'Implement a Hero class with fields name (String), health (int), and level (int). Provide a takeDamage(int amount) method that reduces health (minimum 0), and an isAlive() method that returns true if health > 0. In main(), create hero Astra with 100 HP and level 1, deal 35 damage, print stats and isAlive, then deal 70 damage and print final stats.',
      tasks: [
        'Declare Hero class fields: String name, int health, and int level',
        'Implement void takeDamage(int amount) to reduce health (cannot drop below 0)',
        'Implement boolean isAlive() returning true when health > 0',
        'In main(), instantiate Astra with 100 HP and level 1',
        'Call hero.takeDamage(35), then print: hero.name + " HP: " + hero.health',
        'Print: "Alive: " + hero.isAlive()',
        'Call hero.takeDamage(70), then print: "Final HP: " + hero.health',
        'Print: "Alive: " + hero.isAlive()'
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define your Hero class here
`,
      testCases: [
        {
          id: 'c1_tc1',
          input: '',
          expectedOutput: 'Astra HP: 65\nAlive: true\nFinal HP: 0\nAlive: false',
          description: 'Validates takeDamage and isAlive state logic',
        },
      ],
      hints: [
        'A class defines state (variables) and behavior (methods).',
        'In takeDamage(amount), subtract amount from health. If health < 0, set health = 0.',
        'Evaluate whether health is strictly greater than 0 and return the boolean result.',
      ],
    },
    missions: [
      {
        id: 'm1_1',
        levelId: 1,
        number: 1,
        title: 'Awakening: The Class Blueprint',
        mode: 'coding_arena',
        storyIntro: 'The Forest Guardian watches as dormant statues await souls. In Java, nothing exists until defined by a class.',
        conceptSummary: 'A class is a blueprint or template from which individual objects are created. Fields hold the state; methods define the behavior.',
        instructions: 'Define a Hero class with name (String) and health (int) fields. In main(), instantiate a Hero object using new Hero(), assign name="Astra" and health=100, and print "Hero: Astra, HP: 100".',
        tasks: [
          'Define the Hero class below Main with fields: String name and int health',
          'In main(), instantiate a new Hero instance using: Hero hero = new Hero();',
          'Set hero.name = "Astra" and hero.health = 100',
          'Print to console: "Hero: " + hero.name + ", HP: " + hero.health'
        ],
        xpReward: 50,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define the Hero class here
`,
        testCases: [
          {
            id: 'm1_1_tc1',
            input: '',
            expectedOutput: 'Hero: Astra, HP: 100',
            description: 'Validates Hero class instantiation and field state output',
          },
        ],
        hints: [
          'Define class fields with their types and names (e.g. String for name, int for health).',
          'Allocate the object on the heap using the new keyword and class constructor.',
          'Assign values to object instance fields using dot notation.',
        ],
        explanation: 'A Class is loaded into Metaspace; Objects reside in the Heap memory.',
      },
      {
        id: 'm1_2',
        levelId: 1,
        number: 2,
        title: 'Summoning the Hero & Methods',
        mode: 'coding_arena',
        storyIntro: 'Piece together the ancient invocation runes. Add a shout() behavior method so the Hero can rally allies.',
        conceptSummary: 'Instance methods define the behaviors that an object can perform and can read or modify its instance variables.',
        instructions: 'Add a void shout() method inside the Hero class that prints "[name] shouts: For the Realm!". In main(), create a Hero with name "Valiant", and call hero.shout().',
        tasks: [
          'Create a Hero class with String name field',
          'Inside Hero, define void shout() that prints: name + " shouts: For the Realm!"',
          'In main(), instantiate a Hero, set name = "Valiant"',
          'Call hero.shout()'
        ],
        xpReward: 75,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define the Hero class here
`,
        testCases: [
          {
            id: 'm1_2_tc1',
            input: '',
            expectedOutput: 'Valiant shouts: For the Realm!',
            description: 'Validates method invocation and instance field binding',
          },
        ],
        hints: [
          'Methods have a return type (void if returning nothing) and a parameter list.',
          'Invoke instance methods on an object reference using dot notation.',
        ],
        explanation: 'Instance methods can directly access instance variables of the current object.',
      },
      {
        id: 'm1_3',
        levelId: 1,
        number: 3,
        title: 'Bug Hunter: Fixing Null References',
        mode: 'coding_arena',
        storyIntro: 'A corrupted spell causes a NullPointerException when accessing an uninitialized object variable.',
        conceptSummary: 'Declaring an object reference does NOT instantiate it in memory. Accessing fields on a null reference crashes the program with NullPointerException.',
        instructions: 'Fix the bug in main() by instantiating the Warrior object with "new Warrior()" so that warrior.hp can be accessed safely.',
        tasks: [
          'Locate the uninitialized Warrior reference in main() causing NullPointerException',
          'Instantiate the Warrior object: Warrior warrior = new Warrior();',
          'Assign warrior.hp = 120 and verify the program prints "Warrior HP: 120"'
        ],
        xpReward: 75,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // BUG: warrior is declared but not initialized (holds null)!
        // Fix this statement by instantiating a new Warrior():
        Warrior warrior = null;
        
        warrior.hp = 120;
        System.out.println("Warrior HP: " + warrior.hp);
    }
}

class Warrior {
    int hp;
}
`,
        testCases: [
          {
            id: 'm1_3_tc1',
            input: '',
            expectedOutput: 'Warrior HP: 120',
            description: 'Verifies null reference fix and heap allocation',
          },
        ],
        hints: [
          'Instantiate the object on the heap using the new keyword so the reference is no longer null.',
          'References hold null until assigned an address pointing to a heap object.',
        ],
        explanation: 'Warrior warrior; only allocates a reference on the stack holding null until new Warrior() is called.',
      },
      {
        id: 'm1_4',
        levelId: 1,
        number: 4,
        title: 'Predict & Prove: Independent States',
        mode: 'coding_arena',
        storyIntro: 'Two distinct hero objects are created. Does mutating one alter the other in heap memory?',
        conceptSummary: 'Each object instance maintains its own separate copy of instance variables in the heap.',
        instructions: 'Create two independent Hero instances: heroA and heroB. Set both hp to 100. Subtract 20 from heroA.hp only. Print "heroA: 80, heroB: 100".',
        tasks: [
          'Define class Hero with int hp field',
          'In main(), create two independent Hero instances: heroA and heroB',
          'Initialize both with hp = 100',
          'Subtract 20 from heroA.hp only',
          'Print: "heroA: " + heroA.hp + ", heroB: " + heroB.hp'
        ],
        xpReward: 75,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define the Hero class here
`,
        testCases: [
          {
            id: 'm1_4_tc1',
            input: '',
            expectedOutput: 'heroA: 80, heroB: 100',
            description: 'Validates independent heap instances and state isolation',
          },
        ],
        hints: ['heroA and heroB point to two distinct memory addresses in the heap.'],
        explanation: 'Each new invocation creates an isolated instance. Changes to heroA do not affect heroB.',
      },
      {
        id: 'm1_5',
        levelId: 1,
        number: 5,
        title: 'The Method of Power: Sacred Healing',
        mode: 'coding_arena',
        storyIntro: 'Give your entity the ability to heal using an instance method that modifies internal state.',
        conceptSummary: 'Instance methods operate on the specific object that invoked them via the this reference.',
        instructions: 'Define a Knight class with int health field. Write a heal(int amount) method that adds amount to health. In main(), create knight with health 40, heal 25, and print "Knight HP: 65".',
        tasks: [
          'Define Knight class with int health field',
          'Implement void heal(int amount) method that adds amount to health',
          'In main(), instantiate Knight with health = 40',
          'Call knight.heal(25)',
          'Print: "Knight HP: " + knight.health'
        ],
        xpReward: 100,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define the Knight class here
`,
        testCases: [
          {
            id: 'm1_5_t1',
            input: '',
            expectedOutput: 'Knight HP: 65',
            description: 'Heals the knight from 40 to 65',
          },
        ],
        hints: ['Add the healing amount to the current health instance variable.'],
        explanation: 'Instance methods operate on the specific object that invoked them via the this reference.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 02: CONSTRUCTOR FORGE
  // =========================================================================
  {
    id: 2,
    slug: 'constructor-forge',
    title: 'Constructor Forge',
    subtitle: 'Forging Valid Configurations & Class Members',
    realmName: 'The Molten Anvil',
    iconName: 'Flame',
    description: 'Learn default and parameterized constructors, constructor overloading, the this keyword, and static vs instance members.',
    topics: [
      'Constructors & Initialization',
      'Constructor Overloading',
      'The this Keyword',
      'static vs Instance Members',
      'Factory Initialization',
    ],
    story: 'In the volcanic depths of the Forge, weapons forged without proper temperature and alloy crumble into ash. Every object must be initialized through rigorous constructors.',
    totalXP: 600,
    requiredLevelToUnlock: 2,
    prerequisiteLevelId: 1,
    bossChallenge: {
      title: 'Defeat the Forge Master',
      description: 'Create a Weapon class with private fields name, attackPower, and durability. Implement overloaded constructors: a default constructor setting "Rusty Dagger", 5, 20 via this(...); and a parameterized constructor Weapon(name, attack, dur). Maintain a public static int totalWeaponsForged counter that increments on every instantiation. Provide getInfo() returning "name [ATK: attackPower, DUR: durability]". In main(), instantiate w1 and w2 and print their info and total forged count.',
      tasks: [
        'Declare public static int totalWeaponsForged = 0 in Weapon',
        'Declare private fields: String name, int attackPower, int durability',
        'Implement parameterized constructor Weapon(name, attack, dur) and increment totalWeaponsForged',
        'Implement default constructor Weapon() chaining via this("Rusty Dagger", 5, 20)',
        'Implement String getInfo() returning: name + " [ATK: " + attackPower + ", DUR: " + durability + "]"',
        'In main(), instantiate Weapon w1 = new Weapon() and Weapon w2 = new Weapon("Excalibur", 85, 100)',
        'Print w1.getInfo(), w2.getInfo(), and "Total Forged: " + Weapon.totalWeaponsForged'
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define the Weapon class here
`,
      testCases: [
        {
          id: 'c2_tc1',
          input: '',
          expectedOutput: 'Rusty Dagger [ATK: 5, DUR: 20]\nExcalibur [ATK: 85, DUR: 100]\nTotal Forged: 2',
          description: 'Validates constructor chaining and static counter tracking',
        },
      ],
      hints: [
        'Use constructor chaining with this(...) to provide default attribute values.',
        'Increment totalWeaponsForged in the constructor so every created object is counted.',
      ],
    },
    missions: [
      {
        id: 'm2_1',
        levelId: 2,
        number: 1,
        title: 'The Default Fallacy: Custom Initializers',
        mode: 'coding_arena',
        storyIntro: 'The Forge Master scoffs at uninitialized blades. When you provide a custom constructor, Java removes the default no-arg constructor.',
        conceptSummary: 'Constructors initialize newly allocated heap memory. If you declare ANY constructor, Java will NOT generate a default no-argument constructor automatically.',
        instructions: 'Define ForgeBlade with fields String type and int sharpness. Create a constructor ForgeBlade(String type, int sharpness). In main(), instantiate with "Mithril" and 90, then print "Blade: Mithril [Sharpness: 90]".',
        tasks: [
          'Define ForgeBlade class with fields: String type and int sharpness',
          'Create parameterized constructor: ForgeBlade(String type, int sharpness)',
          'In main(), instantiate blade with: new ForgeBlade("Mithril", 90)',
          'Print: "Blade: " + blade.type + " [Sharpness: " + blade.sharpness + "]"'
        ],
        xpReward: 60,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define the ForgeBlade class here
`,
        testCases: [
          {
            id: 'm2_1_tc1',
            input: '',
            expectedOutput: 'Blade: Mithril [Sharpness: 90]',
            description: 'Validates parameterized constructor initialization',
          },
        ],
        hints: [
          'Use the this keyword to disambiguate instance variables from constructor parameters.',
        ],
        explanation: 'Constructors ensure an object never enters the system in a corrupted or half-initialized state.',
      },
      {
        id: 'm2_2',
        levelId: 2,
        number: 2,
        title: 'The Chamber of static: Class Counters',
        mode: 'coding_arena',
        storyIntro: 'The Forge maintains a global tally of all anvils forged across the entire continent using static memory.',
        conceptSummary: 'Static members belong to the class itself rather than individual instances. There is only ONE copy shared across all objects.',
        instructions: 'Maintain a static counter totalAnvils in the Anvil class that increments every time a new Anvil is instantiated. In main(), create 3 Anvil objects and print "Total Anvils: 3".',
        tasks: [
          'Declare public static int totalAnvils = 0 inside Anvil class',
          'Inside the Anvil constructor, increment totalAnvils++',
          'Instantiate 3 Anvil objects in main()',
          'Print: "Total Anvils: " + Anvil.totalAnvils'
        ],
        xpReward: 90,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define the Anvil class here
`,
        testCases: [
          {
            id: 'm2_2_tc1',
            input: '',
            expectedOutput: 'Total Anvils: 3',
            description: 'Validates static class variable increment across multiple instances',
          },
        ],
        hints: ['static variables are accessed via ClassName.variableName: Anvil.totalAnvils.'],
        explanation: 'Static variables are allocated once when the class is loaded by the ClassLoader.',
      },
      {
        id: 'm2_3',
        levelId: 2,
        number: 3,
        title: 'Coding Arena: Overloaded Bows',
        mode: 'coding_arena',
        storyIntro: 'Craft an Archer bow that can be built with just a name, or with a name and custom arrow capacity.',
        conceptSummary: 'Constructor overloading provides multiple ways to instantiate an object with varying degrees of specification.',
        instructions: 'Implement two constructors for Bow: Bow(String name) defaulting to 20 arrows, and Bow(String name, int arrows). In main(), create b1 ("Recurve") and b2 ("Longbow", 45) and print their stats.',
        tasks: [
          'Define Bow class with fields: String name and int arrows',
          'Implement 1-parameter constructor Bow(String name) chaining to this(name, 20)',
          'Implement 2-parameter constructor Bow(String name, int arrows)',
          'In main(), create b1 = new Bow("Recurve") and b2 = new Bow("Longbow", 45)',
          'Print: b1.name + ": " + b1.arrows + " arrows"',
          'Print: b2.name + ": " + b2.arrows + " arrows"'
        ],
        xpReward: 100,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define the Bow class here
`,
        testCases: [
          {
            id: 'm2_3_t1',
            input: '',
            expectedOutput: 'Recurve: 20 arrows\nLongbow: 45 arrows',
            description: 'Validates overloaded constructor delegation',
          },
        ],
        hints: ['Use constructor chaining with this(...) to delegate to the primary constructor.'],
        explanation: 'Chaining constructors minimizes duplicate code and ensures single-point validation.',
      },
    ],
  },

  CONSTRUCTOR_OVERLOADING_LEVEL,

  // =========================================================================
  // LEVEL 4: ENCAPSULATION CITADEL
  // =========================================================================
  {
    id: 4,
    slug: 'encapsulation-citadel',
    title: 'Encapsulation Citadel',
    subtitle: 'Data Hiding & Defensive State Invariants',
    realmName: 'The Iron Bastion',
    iconName: 'Shield',
    description: 'Master access modifiers (private, public, protected, package-private), getters and setters, and state validation.',
    topics: [
      'Access Modifiers (private, public, protected, default)',
      'Data Hiding & Information Concealment',
      'Validation in Mutators (Setters)',
      'Read-Only Fields',
      'Class Invariants',
    ],
    story: 'Malicious rogues seek to tamper with your character health and gold by altering variables directly. Enter the Citadel and seal your internal data behind impenetrable vaults.',
    totalXP: 650,
    requiredLevelToUnlock: 4,
    prerequisiteLevelId: 3,
    bossChallenge: {
      title: 'Defeat the Security Sentinel',
      description: 'Build a secure BankAccount class. Fields accountNumber (String, read-only via getter) and balance (double, private). Implement deposit(double amount) which rejects non-positive amounts, and withdraw(double amount) which returns true if amount <= balance or false otherwise. Provide getBalance() and getAccountNumber(). In main(), test account operations and print output.',
      tasks: [
        'Declare private final String accountNumber and private double balance',
        'In constructor BankAccount(String accNum, double initialBal), set accountNumber, and balance if positive (else 0.0)',
        'Implement public getters: getAccountNumber() and getBalance()',
        'Implement void deposit(double amount) only adding to balance if amount > 0',
        'Implement boolean withdraw(double amount): if amount > 0 and amount <= balance, deduct and return true; else return false',
        'In main(), create account ("VAULT-99", 500.0), test withdraw 200, withdraw 400 (fails), deposit 150, and print balances'
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define the BankAccount class here
`,
      testCases: [
        {
          id: 'c4_tc1',
          input: '',
          expectedOutput: 'Account: VAULT-99\nBalance: 500.0\nWithdrew 200: true, New Bal: 300.0\nWithdrew 400: false, New Bal: 300.0\nFinal Bal: 450.0',
          description: 'Validates boundary protection and invalid operation rejection',
        },
      ],
      hints: [
        'Private fields can only be accessed within the class itself.',
        'Validate incoming parameters in setters/methods before mutating state.',
      ],
    },
    missions: [
      {
        id: 'm4_1',
        levelId: 4,
        number: 1,
        title: 'Vault Security: Private Fields & Getters',
        mode: 'coding_arena',
        storyIntro: 'The gatekeeper guards the kingdom treasury. Exposing raw fields allows hackers to set gold to negative or infinite numbers.',
        conceptSummary: 'Encapsulation restricts direct access to an object\'s fields. Private fields paired with public getters/setters protect class invariants.',
        instructions: 'Create a Vault class with a private String secretCode field and private int goldAmount field. Provide a constructor Vault(String secretCode, int goldAmount) and public getters getSecretCode() and getGoldAmount(). In main(), instantiate Vault("ROYAL-KEY", 1200) and print "Vault Code: ROYAL-KEY, Gold: 1200".',
        tasks: [
          'Create Vault class with private fields: String secretCode and int goldAmount',
          'Implement constructor Vault(String secretCode, int goldAmount) setting both fields',
          'Implement public getter methods: getSecretCode() and getGoldAmount()',
          'In main(), instantiate Vault with "ROYAL-KEY" and 1200',
          'Print: "Vault Code: " + vault.getSecretCode() + ", Gold: " + vault.getGoldAmount()'
        ],
        xpReward: 75,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define the Vault class here
`,
        testCases: [
          {
            id: 'm4_1_tc1',
            input: '',
            expectedOutput: 'Vault Code: ROYAL-KEY, Gold: 1200',
            description: 'Validates private field encapsulation and public getters',
          },
        ],
        hints: ['Encapsulate fields by declaring them with the private access modifier.'],
        explanation: 'Private access modifier prevents external code from directly mutating internal state.',
      },
      {
        id: 'm4_2',
        levelId: 4,
        number: 2,
        title: 'Defensive Setter: Guarding Invariants',
        mode: 'coding_arena',
        storyIntro: 'An enemy tries to corrupt your player shield by setting defense points to a negative number!',
        conceptSummary: 'Setters can validate values before applying changes, preserving the integrity of object state.',
        instructions: 'Create a Shield class with a private int defensePoints field. Provide getDefensePoints() and setDefensePoints(int points). The setter must only update defensePoints if points >= 0; if points < 0, do not update. In main(), create a shield, set defense to 50, attempt to set defense to -20 (rejected), and print "Shield Defense: 50".',
        tasks: [
          'Create Shield class with private int defensePoints field',
          'Implement int getDefensePoints()',
          'Implement void setDefensePoints(int points) that only updates defensePoints if points >= 0',
          'In main(), instantiate Shield, call shield.setDefensePoints(50)',
          'Call shield.setDefensePoints(-20) (should be rejected)',
          'Print: "Shield Defense: " + shield.getDefensePoints()'
        ],
        xpReward: 85,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define the Shield class here
`,
        testCases: [
          {
            id: 'm4_2_tc1',
            input: '',
            expectedOutput: 'Shield Defense: 50',
            description: 'Validates defensive setter logic preventing negative state corruption',
          },
        ],
        hints: ['Validate the incoming argument before mutating the private field.'],
        explanation: 'Mutator validation prevents an object from entering an illegal or corrupted state.',
      },
    ],
  },

  METHOD_OVERLOADING_LEVEL,

  // =========================================================================
  // LEVEL 6: INHERITANCE MOUNTAINS
  // =========================================================================
  {
    id: 6,
    slug: 'inheritance-mountains',
    title: 'Inheritance Mountains',
    subtitle: 'The Lineage of the Elders & The extends Keyword',
    realmName: 'The Granite Peaks',
    iconName: 'Mountain',
    description: 'Master the extends keyword, class hierarchies, the super keyword for constructor delegation and method calls, and protected access.',
    topics: [
      'The extends Keyword',
      'The super Keyword & Constructors',
      'Code Reuse via Inheritance',
      'Method Overriding (@Override)',
      'The Object Root Class',
    ],
    story: 'Ascend the ancient peaks where ancestral knowledge flows down through generations. Discover how child classes inherit strength from their base classes.',
    totalXP: 700,
    requiredLevelToUnlock: 6,
    prerequisiteLevelId: 5,
    bossChallenge: {
      title: 'Defeat the Mountain Titan',
      description: 'Create a base Hero class with name and hp, and a displayStats() method. Extend it with Warrior (adding int armor) and Mage (adding int mana). Override displayStats() in both subclasses to print subclass-specific stats using super.displayStats(). In main(), instantiate both, call displayStats(), and verify output.',
      tasks: [
        'Create class Hero with protected String name and protected int hp',
        'Implement Hero constructor Hero(String name, int hp)',
        'Implement String getBaseStats() returning name + " [HP: " + hp + "]"',
        'Create subclass Warrior extending Hero with private int armor, delegating to super(name, hp)',
        'Create subclass Mage extending Hero with private int mana, delegating to super(name, hp)',
        'In Warrior, implement String getStats() returning getBaseStats() + " [Armor: " + armor + "]"',
        'In Mage, implement String getStats() returning getBaseStats() + " [Mana: " + mana + "]"',
        'In main(), instantiate Warrior("Garen", 200, 30) and Mage("Lux", 100, 15), and print their getStats()'
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define Hero, Warrior, and Mage classes here
`,
      testCases: [
        {
          id: 'c6_tc1',
          input: '',
          expectedOutput: 'Garen [HP: 200] [Armor: 30]\nLux [HP: 100] [Mana: 15]',
          description: 'Validates subclass constructor delegation and specialized behavior extension',
        },
      ],
      hints: [
        'Inherit from the base class using the extends keyword.',
        'Delegate initialization to the superclass constructor using super(...) as the first statement.',
      ],
    },
    missions: [
      {
        id: 'm6_1',
        levelId: 6,
        number: 1,
        title: 'Lineage of the Elders: The extends Keyword',
        mode: 'coding_arena',
        storyIntro: 'An Elder Guardian passes down their ancient abilities to a young apprentice.',
        conceptSummary: 'Inheritance allows a child class to inherit fields and methods from a parent class using the extends keyword, enabling code reuse.',
        instructions: 'Create a base Character class with String name field and a speak() method printing "[name] speaks.". Create a child class Knight extending Character. In main(), create Knight with name "Arthur", call knight.speak(), and verify output.',
        tasks: [
          'Create Character class with String name field and void speak() printing name + " speaks."',
          'Create Knight class that extends Character using: class Knight extends Character {}',
          'In main(), instantiate Knight knight = new Knight()',
          'Assign knight.name = "Arthur"',
          'Call knight.speak()'
        ],
        xpReward: 80,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define Character and Knight classes here
`,
        testCases: [
          {
            id: 'm6_1_tc1',
            input: '',
            expectedOutput: 'Arthur speaks.',
            description: 'Validates single inheritance and inherited method invocation',
          },
        ],
        hints: ['Child class inherits all non-private members of the parent class.'],
        explanation: 'Inheritance creates an IS-A relationship between subclasses and superclasses.',
      },
    ],
  },

  METHOD_OVERRIDING_LEVEL,

  // =========================================================================
  // LEVEL 8: POLYMORPHISM ARENA
  // =========================================================================
  {
    id: 8,
    slug: 'polymorphism-arena',
    title: 'Polymorphism Arena',
    subtitle: 'Many Forms, One Command & Dynamic Method Dispatch',
    realmName: 'The Colosseum of Echoes',
    iconName: 'Swords',
    description: 'Master runtime polymorphism, method overriding, dynamic dispatch, polymorphic collections, and the instanceof operator.',
    topics: [
      'Compile-Time Polymorphism (Method Overloading)',
      'Runtime Polymorphism (Method Overriding)',
      'Dynamic Method Dispatch',
      'Polymorphic References & Arrays',
      'The instanceof Operator',
    ],
    story: 'Enter the Grand Colosseum where combatants take many forms. A single commander gives one order: "Attack!", and every warrior executes their unique fighting style.',
    totalXP: 750,
    requiredLevelToUnlock: 8,
    prerequisiteLevelId: 7,
    bossChallenge: {
      title: 'Conquer the Polymorphism Arena',
      description: 'Create an abstract or base Combatant class with a String attack() method. Create three subclasses: Archer ("Fires piercing arrow!"), Berserker ("Swings heavy axe!"), and Sorcerer ("Casts blazing fireball!"). In main(), store all three in a polymorphic Combatant[] array, iterate over them, and print each attack().',
      tasks: [
        'Create class Combatant with String attack() returning "Strikes enemy!"',
        'Create class Archer extending Combatant, overriding attack() to return "Fires piercing arrow!"',
        'Create class Berserker extending Combatant, overriding attack() to return "Swings heavy axe!"',
        'Create class Sorcerer extending Combatant, overriding attack() to return "Casts blazing fireball!"',
        'In main(), create Combatant[] team = new Combatant[] { new Archer(), new Berserker(), new Sorcerer() };',
        'Loop through the array and print each c.attack()'
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define Combatant, Archer, Berserker, and Sorcerer classes here
`,
      testCases: [
        {
          id: 'c8_tc1',
          input: '',
          expectedOutput: 'Fires piercing arrow!\nSwings heavy axe!\nCasts blazing fireball!',
          description: 'Validates polymorphic dispatch across array elements at runtime',
        },
      ],
      hints: [
        'Declare the variable type as the superclass/interface and instantiate a concrete subclass.',
        'Dynamic dispatch resolves the actual overridden method on the heap object.',
      ],
    },
    missions: [
      {
        id: 'm8_1',
        levelId: 8,
        number: 1,
        title: 'The Single Command: Polymorphic Sound',
        mode: 'coding_arena',
        storyIntro: 'A ranger commands animal companions with a single whistle.',
        conceptSummary: 'Polymorphism allows treating child objects through a common parent reference, executing the child\'s version of overridden methods.',
        instructions: 'Create an Animal class with a void makeSound() method printing "Generic sound". Create Dog (overriding to print "Woof!") and Cat (overriding to print "Meow!"). In main(), assign Dog and Cat to Animal reference variables and call makeSound() on both.',
        tasks: [
          'Create Animal class with void makeSound() printing "Generic sound"',
          'Create Dog class extending Animal, overriding makeSound() to print "Woof!"',
          'Create Cat class extending Animal, overriding makeSound() to print "Meow!"',
          'In main(), create Animal a1 = new Dog() and Animal a2 = new Cat()',
          'Call a1.makeSound() and a2.makeSound()'
        ],
        xpReward: 85,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define Animal, Dog, and Cat classes here
`,
        testCases: [
          {
            id: 'm8_1_tc1',
            input: '',
            expectedOutput: 'Woof!\nMeow!',
            description: 'Validates dynamic method dispatch on overridden methods',
          },
        ],
        hints: ['Use @Override annotation above the child makeSound() method.'],
        explanation: 'The JVM determines which method to invoke based on the actual object runtime type.',
      },
      {
        id: 'm8_2',
        levelId: 8,
        number: 2,
        title: 'Compile-Time Polymorphism: Method Overloading',
        mode: 'coding_arena',
        storyIntro: 'An elemental spellcaster prepares multiple invocations of the same spell with varying intensity and arguments.',
        conceptSummary: 'Method Overloading allows multiple methods in the same class to share the same name with different parameter signatures (different type, count, or order of parameters). It is resolved at compile time.',
        instructions: 'Create a SpellCaster class with three overloaded castSpell methods: 1) String castSpell() returning "Casting Spark", 2) String castSpell(String spellName) returning "Casting " + spellName, and 3) String castSpell(String spellName, int power) returning "Casting " + spellName + " at Level " + power. In main(), call all three methods and print the returned values.',
        tasks: [
          'Create class SpellCaster',
          'Implement String castSpell() returning "Casting Spark"',
          'Implement String castSpell(String spellName) returning "Casting " + spellName',
          'Implement String castSpell(String spellName, int power) returning "Casting " + spellName + " at Level " + power',
          'In main(), instantiate SpellCaster caster = new SpellCaster()',
          'Print caster.castSpell(), caster.castSpell("Fireball"), and caster.castSpell("Lightning", 5)'
        ],
        xpReward: 90,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define SpellCaster class with overloaded castSpell methods here
`,
        testCases: [
          {
            id: 'm8_2_tc1',
            input: '',
            expectedOutput: 'Casting Spark\nCasting Fireball\nCasting Lightning at Level 5',
            description: 'Validates method overloading with zero, one, and two parameters',
          },
        ],
        hints: [
          'Overloaded methods must have identical names but distinct parameter lists (different types or counts).',
          'Return types alone cannot distinguish overloaded methods.',
        ],
        explanation: 'Method overloading enables static polymorphism where method resolution occurs at compile time based on invocation argument signatures.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 9: ABSTRACTION TEMPLE
  // =========================================================================
  {
    id: 9,
    slug: 'abstraction-temple',
    title: 'Abstraction Temple',
    subtitle: 'Pure Contracts & Abstract Realms',
    realmName: 'The High Sanctuary',
    iconName: 'Sparkles',
    description: 'Master abstract classes, abstract methods, Java interfaces, default and static interface methods, and multiple interface implementation.',
    topics: [
      'abstract Classes vs Interfaces',
      'abstract Methods',
      'The implements Keyword',
      'Multiple Interface Inheritance',
      'Contract Enforcement',
    ],
    story: 'High in the clouds sits the Sanctuary of Pure Thought. Here, concrete details dissolve into pure contracts: what must be done, without dictating how.',
    totalXP: 800,
    requiredLevelToUnlock: 9,
    prerequisiteLevelId: 8,
    bossChallenge: {
      title: 'Defeat the Temple Golem',
      description: 'Create an interface Damageable with void takeDamage(int amount) and int getHealth(). Create an abstract class Monster implementing Damageable, with protected int health. Create class Golem extending Monster with 50% damage reduction armor: taking damage of 40 reduces health by only 20! In main(), test Golem with 100 HP, deal 40 damage, and print "Golem HP: 80".',
      tasks: [
        'Create interface Damageable with void takeDamage(int amount) and int getHealth()',
        'Create abstract class Monster implementing Damageable with protected int health',
        'Create Golem extending Monster: in takeDamage(amount), subtract (amount / 2) from health',
        'In main(), create Golem with 100 health, call golem.takeDamage(40)',
        'Print: "Golem HP: " + golem.getHealth()'
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define Damageable interface, Monster abstract class, and Golem class here
`,
      testCases: [
        {
          id: 'c9_tc1',
          input: '',
          expectedOutput: 'Golem HP: 80',
          description: 'Validates interface implementation and abstract class contract realization',
        },
      ],
      hints: [
        'An interface defines method signatures without bodies.',
        'An abstract class cannot be directly instantiated with new.',
      ],
    },
    missions: [
      {
        id: 'm9_1',
        levelId: 9,
        number: 1,
        title: 'The Pure Contract: Interface Implementation',
        mode: 'coding_arena',
        storyIntro: 'The sanctuary monks forge spells that adhere to sacred seals.',
        conceptSummary: 'An interface defines a contract that implementing classes must satisfy by overriding all abstract methods.',
        instructions: 'Define an interface Spell with String cast(). Implement it in Fireball ("Blazing fireball cast!") and IceShard ("Piercing ice shard cast!"). In main(), cast both spells and print output.',
        tasks: [
          'Create interface Spell with method: String cast();',
          'Create class Fireball implementing Spell, returning "Blazing fireball cast!"',
          'Create class IceShard implementing Spell, returning "Piercing ice shard cast!"',
          'In main(), instantiate Fireball and IceShard',
          'Print both spell.cast() results'
        ],
        xpReward: 90,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define Spell interface, Fireball, and IceShard classes here
`,
        testCases: [
          {
            id: 'm9_1_tc1',
            input: '',
            expectedOutput: 'Blazing fireball cast!\nPiercing ice shard cast!',
            description: 'Validates interface contract implementation across concrete classes',
          },
        ],
        hints: ['Implement the contract defined by the interface using the implements keyword.'],
        explanation: 'Interfaces allow classes with unrelated lineages to share common behavior contracts.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 10: RELATIONSHIP LABYRINTH
  // =========================================================================
  {
    id: 10,
    slug: 'relationship-labyrinth',
    title: 'Relationship Labyrinth',
    subtitle: 'Association, Aggregation & Composition',
    realmName: 'The Nexus of Bonds',
    iconName: 'Network',
    description: 'Master object relationships: Association (uses-a), Aggregation (has-a with independent lifetime), and Composition (part-of with shared lifetime).',
    topics: [
      'Association (uses-a)',
      'Aggregation (has-a independent)',
      'Composition (has-a owned/dependent)',
      'Deep vs Shallow Copies',
      'Defensive Copying',
    ],
    story: 'Navigate the labyrinth of connections where entities bond, collaborate, and form complex living systems.',
    totalXP: 850,
    requiredLevelToUnlock: 10,
    prerequisiteLevelId: 9,
    bossChallenge: {
      title: 'Solve the Labyrinth Core',
      description: 'Implement a Guild system demonstrating Composition and Aggregation. Guild owns its GuildHall (composition: created inside Guild constructor), and aggregates Members (List<Member> added externally). Provide getSummary() returning the guild name, hall name, and count of members. In main(), create Guild "Knights of the Round", hall "Camelot", add 2 members ("Arthur", "Lancelot"), and print getSummary().',
      tasks: [
        'Create class GuildHall with String name field',
        'Create class Member with String name field',
        'Create class Guild with String name, GuildHall hall (composition), and List<Member> members (aggregation)',
        'In Guild constructor Guild(String name, String hallName), instantiate hall = new GuildHall(hallName)',
        'Implement void addMember(Member m) to add to members list',
        'Implement String getSummary() returning: name + " | Hall: " + hall.name + " | Members: " + members.size()',
        'In main(), instantiate Guild, add Arthur and Lancelot, and print guild.getSummary()'
      ],
      starterCode: `import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define GuildHall, Member, and Guild classes here
`,
      testCases: [
        {
          id: 'c10_tc1',
          input: '',
          expectedOutput: 'Knights of the Round | Hall: Camelot | Members: 2',
          description: 'Validates composition and aggregation relationships in Java',
        },
      ],
      hints: [
        'Composition: the child object is instantiated inside the parent class constructor.',
        'Aggregation: child objects are passed into the parent via methods.',
      ],
    },
    missions: [
      {
        id: 'm10_1',
        levelId: 10,
        number: 1,
        title: 'The Bond of Weapons: Aggregation',
        mode: 'coding_arena',
        storyIntro: 'A warrior equips a sword found in an ancient ruin. When the warrior rests, the sword remains intact.',
        conceptSummary: 'Aggregation represents a HAS-A relationship where the child object can exist independently of the parent object.',
        instructions: 'Create a Weapon class with String name. Create a Fighter class with String name and Weapon weapon. Provide equip(Weapon w) and printEquipped(). In main(), create Weapon "Excalibur", Fighter "Arthur", equip it, and print "Arthur wields Excalibur".',
        tasks: [
          'Create Weapon class with String name field and constructor Weapon(String name)',
          'Create Fighter class with String name field and Weapon weapon field',
          'Implement void equip(Weapon w) setting weapon = w',
          'In main(), create weapon "Excalibur" and fighter "Arthur"',
          'Call fighter.equip(weapon)',
          'Print: fighter.name + " wields " + fighter.weapon.name'
        ],
        xpReward: 90,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define Weapon and Fighter classes here
`,
        testCases: [
          {
            id: 'm10_1_tc1',
            input: '',
            expectedOutput: 'Arthur wields Excalibur',
            description: 'Validates aggregation reference binding',
          },
        ],
        hints: ['Fighter holds a reference to a Weapon object passed into it.'],
        explanation: 'In aggregation, lifecycle of child does not depend on the parent.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 11: AGGREGATION MASTERY (10 CHALLENGES: SIMPLE -> HARD)
  // =========================================================================
  AGGREGATION_MASTERY_LEVEL,

  // =========================================================================
  // LEVEL 12: COMPOSITION MASTERY (10 CHALLENGES: SIMPLE -> HARD)
  // =========================================================================
  COMPOSITION_MASTERY_LEVEL,

  // =========================================================================
  // LEVEL 13: EXCEPTION DUNGEON
  // =========================================================================
  {
    id: 13,
    slug: 'exception-dungeon',
    title: 'Exception Dungeon',
    subtitle: 'Defensive Fortresses & Fault Tolerance',
    realmName: 'The Abyssal Vault',
    iconName: 'AlertTriangle',
    description: 'Master checked vs unchecked exceptions, try-catch-finally, custom exception hierarchies, and robust error recovery.',
    topics: [
      'Throwable Hierarchy (Exception vs Error)',
      'Checked vs Unchecked (RuntimeException)',
      'try-catch-finally Blocks',
      'try-with-resources & AutoCloseable',
      'Custom Exception Classes',
    ],
    story: 'Descend into the dark chambers of the dungeon where magical failures and corrupted energies threaten to collapse reality unless safely handled.',
    totalXP: 900,
    requiredLevelToUnlock: 13,
    prerequisiteLevelId: 12,
    bossChallenge: {
      title: 'Defeat the Dungeon Dread',
      description: 'Implement a StaminaSystem with int stamina (initial 25). Create a custom InsufficientStaminaException extending Exception. Provide performAction(int cost) throwing InsufficientStaminaException if cost > stamina. In main(), perform action costing 15 (succeeds, remaining 10), then attempt action costing 20 (catches exception and prints message), then print "Final Stamina: 10".',
      tasks: [
        'Create custom checked exception InsufficientStaminaException extending Exception with constructor(String message)',
        'Create class StaminaSystem with private int stamina',
        'In constructor StaminaSystem(int stamina), initialize field',
        'Implement void performAction(int cost) throws InsufficientStaminaException: if cost > stamina throw exception; else stamina -= cost',
        'In main(), perform action costing 15 and print "Action performed, remaining: " + stamina',
        'In try-catch, attempt action costing 20, catch InsufficientStaminaException and print "Caught: " + e.getMessage()',
        'Print: "Final Stamina: " + system.getStamina()'
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define InsufficientStaminaException and StaminaSystem classes here
`,
      testCases: [
        {
          id: 'c11_tc1',
          input: '',
          expectedOutput: 'Action performed, remaining: 10\nCaught: Not enough stamina\nFinal Stamina: 10',
          description: 'Validates custom checked exception declaration, throwing, and catch block handling',
        },
      ],
      hints: [
        'Create a custom checked exception class by extending Exception.',
        'Declare throws clause on methods that throw checked exceptions: void performAction(int cost) throws InsufficientStaminaException',
      ],
    },
    missions: [
      {
        id: 'm13_exc_1',
        levelId: 13,
        number: 1,
        title: 'The Uncaught Catastrophe: try-catch',
        mode: 'coding_arena',
        storyIntro: 'A magical potion calculation divides by zero, threatening to terminate the runtime process.',
        conceptSummary: 'Uncaught exceptions immediately crash the Java thread. Using try-catch allows gracefully handling failures.',
        instructions: 'In main(), wrap a division by zero in a try block: int result = 100 / 0;. Catch ArithmeticException and print "Caught: Division by zero caught safely!". Then print "Execution continued safely.".',
        tasks: [
          'Inside main(), write a try block',
          'Attempt integer division: int val = 100 / 0;',
          'Catch ArithmeticException e',
          'Print: "Caught: Division by zero caught safely!"',
          'Outside the try-catch block, print: "Execution continued safely."'
        ],
        xpReward: 95,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}
`,
        testCases: [
          {
            id: 'm11_1_tc1',
            input: '',
            expectedOutput: 'Caught: Division by zero caught safely!\nExecution continued safely.',
            description: 'Validates arithmetic exception intercept and recovery flow',
          },
        ],
        hints: ['Wrap risky code in a try block and catch the specific exception type.'],
        explanation: 'Handling exceptions restores normal program flow.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 14: COLLECTIONS KINGDOM
  // =========================================================================
  {
    id: 14,
    slug: 'collections-kingdom',
    title: 'Collections Kingdom',
    subtitle: 'Data Structures, Generics & The Java Collections Framework',
    realmName: 'The Vault of Endless Tomes',
    iconName: 'Boxes',
    description: 'Master List (ArrayList, LinkedList), Set (HashSet), Map (HashMap), equals and hashCode contracts, and Generics.',
    topics: [
      'Java Collections Framework Overview',
      'List (ArrayList) vs Set (HashSet)',
      'Map (HashMap) Key-Value Pairs',
      'The equals() and hashCode() Contract',
      'Generics & Type Safety',
    ],
    story: 'Enter the vast archives of the kingdom where millions of items, artifacts, and spells are cataloged using specialized Java collection structures.',
    totalXP: 950,
    requiredLevelToUnlock: 14,
    prerequisiteLevelId: 13,
    bossChallenge: {
      title: 'Organize the Royal Archives',
      description: 'Implement an InventoryManager that uses a Map<String, Integer> to track item stock. Provide addItem(String item, int qty) to accumulate quantity, and printInventory() to print each item and its count in alphabetical order. In main(), add ("Potion", 5), ("Elixir", 2), and ("Potion", 3). Print total Potions and Elixirs.',
      tasks: [
        'Create class InventoryManager using Map<String, Integer> stock = new TreeMap<>() (for alphabetical ordering)',
        'Implement void addItem(String item, int qty) accumulating counts: stock.put(item, stock.getOrDefault(item, 0) + qty)',
        'Implement void printInventory() printing each "item: count"',
        'In main(), add ("Potion", 5), ("Elixir", 2), and ("Potion", 3)',
        'Call printInventory()'
      ],
      starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define InventoryManager class here
`,
      testCases: [
        {
          id: 'c12_tc1',
          input: '',
          expectedOutput: 'Elixir: 2\nPotion: 8',
          description: 'Validates Map key-value accumulation and sorted iteration',
        },
      ],
      hints: [
        'Use TreeMap<String, Integer> to automatically keep keys sorted alphabetically.',
        'Use map.getOrDefault(key, 0) + qty to update existing quantities.',
      ],
    },
    missions: [
      {
        id: 'm14_col_1',
        levelId: 14,
        number: 1,
        title: 'Choosing the Right Container: List vs Set',
        mode: 'coding_arena',
        storyIntro: 'The royal librarian filters duplicate rune stones from the inventory.',
        conceptSummary: 'List maintains insertion order and allows duplicates. Set stores only unique elements.',
        instructions: 'In main(), create a List<String> list and add "Fire", "Water", "Fire". Print "List count: " + list.size(). Then create a Set<String> set and add the same three elements. Print "Set count: " + set.size().',
        tasks: [
          'Create a List<String> and add "Fire", "Water", "Fire"',
          'Print: "List count: " + list.size()',
          'Create a Set<String> and add "Fire", "Water", "Fire"',
          'Print: "Set count: " + set.size()'
        ],
        xpReward: 95,
        starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}
`,
        testCases: [
          {
            id: 'm12_1_tc1',
            input: '',
            expectedOutput: 'List count: 3\nSet count: 2',
            description: 'Validates duplicate allowance in List and uniqueness in Set',
          },
        ],
        hints: ['HashSet automatically ignores duplicate additions.'],
        explanation: 'Set implementations rely on equals() and hashCode() to guarantee uniqueness.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 15: STATIC & INNER REALM
  // =========================================================================
  {
    id: 15,
    slug: 'static-inner-realm',
    title: 'Static & Inner Realm',
    subtitle: 'Enums, Nested Classes & Immutability',
    realmName: 'The Crystal Core',
    iconName: 'Cpu',
    description: 'Master Java enums with custom fields and methods, static nested classes, inner classes, records, and immutable value objects.',
    topics: [
      'Java enums with Fields & Methods',
      'static Nested Classes vs Inner Classes',
      'Anonymous Inner Classes',
      'Java Records (Immutable Value Objects)',
      'Static Initializer Blocks',
    ],
    story: 'Enter the crystalline core where fundamental physical constants and fixed states govern the universe.',
    totalXP: 1000,
    requiredLevelToUnlock: 15,
    prerequisiteLevelId: 14,
    bossChallenge: {
      title: 'Harmonize the Crystal Core',
      description: 'Create an enum GameState with states MENU("Main Menu"), PLAYING("In Battle"), and GAME_OVER("Fallen"). Give each state a String description. Implement boolean canTransitionTo(GameState next) where MENU can transition to PLAYING, and PLAYING can transition to GAME_OVER. In main(), test transitions and print results.',
      tasks: [
        'Declare enum GameState with constants: MENU("Main Menu"), PLAYING("In Battle"), GAME_OVER("Fallen")',
        'Give GameState a private final String description field and a getter getDescription()',
        'Implement boolean canTransitionTo(GameState next) with valid transition rules',
        'In main(), create GameState state = GameState.MENU',
        'Print: "Current: " + state.getDescription()',
        'Print: "Can go to PLAYING: " + state.canTransitionTo(GameState.PLAYING)',
        'Print: "Can go to GAME_OVER: " + state.canTransitionTo(GameState.GAME_OVER)'
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define GameState enum here
`,
      testCases: [
        {
          id: 'c13_tc1',
          input: '',
          expectedOutput: 'Current: Main Menu\nCan go to PLAYING: true\nCan go to GAME_OVER: false',
          description: 'Validates enum state machine logic and constructor field binding',
        },
      ],
      hints: [
        'Enums can have constructors, private fields, and methods just like normal classes.',
        'Use switch(this) or if conditions to implement canTransitionTo.',
      ],
    },
    missions: [
      {
        id: 'm15_enum_1',
        levelId: 15,
        number: 1,
        title: 'Constants of the Cosmos: Custom Enum',
        mode: 'coding_arena',
        storyIntro: 'The alchemist classifies elements by their raw damage multipliers.',
        conceptSummary: 'Enums in Java are full classes that can carry fields, constructors, and behaviors.',
        instructions: 'Define an enum Element with FIRE(25) and ICE(15). Provide a private final int power field and a getter getPower(). In main(), print "FIRE power: " + Element.FIRE.getPower() and "ICE power: " + Element.ICE.getPower().',
        tasks: [
          'Create enum Element with FIRE(25) and ICE(15)',
          'Add private final int power field and constructor Element(int power)',
          'Implement int getPower()',
          'In main(), print FIRE power and ICE power'
        ],
        xpReward: 100,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define Element enum here
`,
        testCases: [
          {
            id: 'm13_1_tc1',
            input: '',
            expectedOutput: 'FIRE power: 25\nICE power: 15',
            description: 'Validates enum constructor and getter invocation',
          },
        ],
        hints: ['Enum constants must be listed first before fields and constructors.'],
        explanation: 'Enums provide type-safe constants with rich object-oriented capabilities.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 16: ARCHITECTURE TOWER
  // =========================================================================
  {
    id: 16,
    slug: 'architecture-tower',
    title: 'Architecture Tower',
    subtitle: 'SOLID Principles & Design Patterns',
    realmName: 'The Citadel of Architects',
    iconName: 'Building',
    description: 'Master the SOLID principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) and design patterns.',
    topics: [
      'SOLID Principles Breakdown',
      'Strategy Pattern (Interchangeable Algorithms)',
      'Observer Pattern (Event Systems)',
      'Factory Method Pattern',
      'Dependency Injection & Loose Coupling',
    ],
    story: 'Ascend to the summit where grand software architects craft scalable, maintainable kingdoms resistant to decay.',
    totalXP: 1100,
    requiredLevelToUnlock: 16,
    prerequisiteLevelId: 15,
    bossChallenge: {
      title: 'Architect the Battle Engine',
      description: 'Implement the Strategy Pattern. Create an interface AttackStrategy with int calculateDamage(int base). Implement MeleeAttack (returns base * 2) and RangedAttack (returns base + 10). Create BattleService with an AttackStrategy field injected via constructor. Provide execute(String target, int base) printing "Attacking [target] for [damage] damage!". In main(), test MeleeAttack with base 30 on "Goblin".',
      tasks: [
        'Create interface AttackStrategy with int calculateDamage(int base)',
        'Create class MeleeAttack implementing AttackStrategy, returning base * 2',
        'Create class RangedAttack implementing AttackStrategy, returning base + 10',
        'Create class BattleService with AttackStrategy strategy injected via constructor',
        'Implement void execute(String target, int base) calculating dmg and printing: "Attacking " + target + " for " + dmg + " damage!"',
        'In main(), create BattleService with MeleeAttack and execute("Goblin", 30)'
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define AttackStrategy, MeleeAttack, RangedAttack, and BattleService classes here
`,
      testCases: [
        {
          id: 'c14_tc1',
          input: '',
          expectedOutput: 'Attacking Goblin for 60 damage!',
          description: 'Validates Strategy Pattern decoupled injection and dynamic calculation',
        },
      ],
      hints: [
        'Dependency Inversion: depend on abstractions (AttackStrategy interface), not concrete classes.',
      ],
    },
    missions: [
      {
        id: 'm16_arch_1',
        levelId: 16,
        number: 1,
        title: 'The Strategy Pattern: Loose Coupling',
        mode: 'coding_arena',
        storyIntro: 'An archer swaps arrowheads dynamically based on the target.',
        conceptSummary: 'The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime.',
        instructions: 'Create an interface PaymentStrategy with void pay(int amount). Implement GoldPayment (prints "Paid " + amount + " in Gold coins."). In main(), create GoldPayment and call pay(50).',
        tasks: [
          'Create interface PaymentStrategy with void pay(int amount)',
          'Create class GoldPayment implementing PaymentStrategy',
          'In GoldPayment, implement pay(int amount) printing: "Paid " + amount + " in Gold coins."',
          'In main(), create GoldPayment payment = new GoldPayment()',
          'Call payment.pay(50)'
        ],
        xpReward: 110,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define PaymentStrategy interface and GoldPayment class here
`,
        testCases: [
          {
            id: 'm14_1_tc1',
            input: '',
            expectedOutput: 'Paid 50 in Gold coins.',
            description: 'Validates Strategy pattern implementation',
          },
        ],
        hints: ['Implement the pay method inside GoldPayment.'],
        explanation: 'Loose coupling allows swapping implementations without touching client logic.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 17: THE MASTER TRIALS
  // =========================================================================
  {
    id: 17,
    slug: 'the-master-trials',
    title: 'The Master Trials',
    subtitle: 'Comprehensive Integration & Architecture Mastery',
    realmName: 'The Trial Grounds',
    iconName: 'Award',
    description: 'Integrate all OOP concepts: encapsulation, inheritance, polymorphism, interfaces, exceptions, collections, and SOLID design.',
    topics: [
      'Comprehensive OOP Synthesis',
      'Domain Modeling',
      'Clean Code & Refactoring',
      'Robust Edge Case Defense',
      'Enterprise Architecture Patterns',
    ],
    story: 'Stand before the Grand Council of Masters. To earn the title of Grand Architect, prove your mastery across the entire spectrum of Java OOP.',
    totalXP: 1200,
    requiredLevelToUnlock: 17,
    prerequisiteLevelId: 16,
    bossChallenge: {
      title: 'Pass the Grand Trial',
      description: 'Build a QuestManager system. Create class Quest with title (String), xp (int), and completed (boolean). Implement addQuest(Quest q), completeQuest(String title), and int getTotalEarnedXp() which sums XP of only completed quests. In main(), add ("Find Crystal", 100) and ("Slay Goblin", 50), complete "Find Crystal", and print "Total XP: 100".',
      tasks: [
        'Create class Quest with fields: String title, int xp, boolean completed = false',
        'Provide Quest constructor Quest(String title, int xp) and getters',
        'Implement void complete() setting completed = true',
        'Create class QuestManager with List<Quest> quests = new ArrayList<>()',
        'Implement void addQuest(Quest q)',
        'Implement void completeQuest(String title) locating the quest and completing it',
        'Implement int getTotalEarnedXp() summing XP of all completed quests',
        'In main(), test the system and print: "Total XP: " + qm.getTotalEarnedXp()'
      ],
      starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define Quest and QuestManager classes here
`,
      testCases: [
        {
          id: 'c15_tc1',
          input: '',
          expectedOutput: 'Total XP: 100',
          description: 'Validates full OOP system state transitions and stream/loop aggregation',
        },
      ],
      hints: [
        'Iterate over the collection and compare titles using .equals() before completing.',
      ],
    },
    missions: [
      {
        id: 'm17_trial_1',
        levelId: 17,
        number: 1,
        title: 'The Council\'s Inquest: Enterprise Entity',
        mode: 'coding_arena',
        storyIntro: 'The Council examines your ability to construct defensive, immutable value objects.',
        conceptSummary: 'Production Java systems rely on robust encapsulation, immutable fields, and defensive copies.',
        instructions: 'Create an immutable PlayerProfile class with private final String username and private final int level. Provide getters for both. In main(), instantiate with "ShadowMage" and 42, and print "Profile: ShadowMage [Level 42]".',
        tasks: [
          'Create PlayerProfile with private final String username and private final int level',
          'Implement constructor PlayerProfile(String username, int level)',
          'Implement getters: getUsername() and getLevel()',
          'In main(), instantiate profile and print: "Profile: " + p.getUsername() + " [Level " + p.getLevel() + "]"'
        ],
        xpReward: 120,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define PlayerProfile class here
`,
        testCases: [
          {
            id: 'm15_1_tc1',
            input: '',
            expectedOutput: 'Profile: ShadowMage [Level 42]',
            description: 'Validates immutable entity construction',
          },
        ],
        hints: ['Final fields must be initialized in the constructor.'],
        explanation: 'Immutability prevents race conditions and unexpected side effects across large systems.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 18: THE ETERNAL KINGDOM (5 FULL-SCALE OOP CAPSTONE PROJECTS)
  // =========================================================================
  {
    id: 18,
    slug: 'the-eternal-kingdom',
    title: 'The Eternal Kingdom',
    subtitle: '5 Complete Real-World OOP Capstone Projects',
    realmName: 'The Celestial Throne',
    iconName: 'Crown',
    description:
      'Design and implement 5 complete Java systems demonstrating Encapsulation, Association, Aggregation, Composition, Abstract Class, Interface, Inheritance, Method Overriding, Polymorphism, Exception Handling, and Custom Exceptions.',
    topics: ETERNAL_KINGDOM_CAPSTONES.map((c) => c.title),
    story:
      'Each stage is a complete real-world Java OOP system written in clear exam-style problem statements—starting with the Smart University Examination & Course Management System.',
    totalXP: 3500,
    requiredLevelToUnlock: 18,
    prerequisiteLevelId: 17,
    bossChallenge: {
      title: ETERNAL_KINGDOM_CAPSTONES[4].title,
      description:
        ETERNAL_KINGDOM_CAPSTONES[4].problemStatement +
        ' ' +
        ETERNAL_KINGDOM_CAPSTONES[4].rejectionRules.join(' '),
      tasks: ETERNAL_KINGDOM_CAPSTONES[4].tasks,
      starterCode: ETERNAL_KINGDOM_CAPSTONES[4].skeletonCode,
      testCases: [
        {
          id: 'c18_boss_tc1',
          input: '',
          expectedOutput: ETERNAL_KINGDOM_CAPSTONES[4].expectedOutput,
          description: 'Validates complete OOP System implementation',
        },
      ],
      hints: ETERNAL_KINGDOM_CAPSTONES[4].oopPillars,
    },
    missions: ETERNAL_KINGDOM_CAPSTONES.map((cap) => ({
      id: `m18_${cap.stageNumber}`,
      levelId: 18,
      number: cap.stageNumber,
      title: cap.title,
      mode: 'coding_arena' as const,
      storyIntro: cap.topic,
      conceptSummary: cap.oopPillars.join(' • '),
      instructions: cap.problemStatement + '\n\n' + cap.rejectionRules.join('\n'),
      tasks: cap.tasks,
      xpReward: 500,
      starterCode: cap.skeletonCode,
      testCases: [
        {
          id: `m18_${cap.stageNumber}_tc1`,
          input: '',
          expectedOutput: cap.expectedOutput,
          description: `Validates complete OOP implementation for ${cap.title}`,
        },
      ],
      hints: cap.oopPillars,
      explanation:
        'This capstone integrates Encapsulation, Association, Aggregation, Composition, Abstract Classes, Interfaces, Inheritance, Method Overriding, Polymorphism, and Custom Exceptions in one complete system.',
    })),
  },
];

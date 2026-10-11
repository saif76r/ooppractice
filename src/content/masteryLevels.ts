import { Level } from '../types';

export const CONSTRUCTOR_OVERLOADING_LEVEL: Level = 
  // =========================================================================
  // LEVEL 3: CONSTRUCTOR OVERLOADING MASTERY
  // =========================================================================
  {
    id: 3,
    slug: 'constructor-overloading',
    title: 'Constructor Overloading Mastery',
    subtitle: 'Multiple Constructors, this(...) Chaining & Object Initialization',
    realmName: 'The Molten Keystone',
    iconName: 'Flame',
    description: 'Master constructor overloading in Java: parameter differentiation, constructor chaining with this(...), copy constructors, and invariant validation.',
    topics: [
      'Default vs Parameterized Constructors',
      'Constructor Chaining with this(...)',
      'Differentiating by Parameter Count & Types',
      'Copy Constructors & State Duplication',
      'Defensive Invariants & Initialization Order',
    ],
    story: 'Deep inside the Molten Keystone, weapons and guardians cannot be forged haphazardly. You must craft flexible constructor signatures that allow warriors to awaken with default gear, custom enchantments, or cloned blueprints.',
    totalXP: 1450,
    requiredLevelToUnlock: 3,
    prerequisiteLevelId: 2,
    bossChallenge: {
      title: 'Boss Challenge: The Master Guild Constructor Forge',
      description: 'The Forge Sentinel demands an authoritative CharacterProfile class with complete constructor overloading coverage: (1) Default constructor setting name="Recruit", role="Warrior", level=1; (2) Name-only constructor setting role="Warrior", level=1 using this(...); (3) Full constructor validating that level is at least 1; (4) Copy constructor creating a separate clone; (5) Method toManifest() returning "[Role] Name - Lv.X". In main(), demonstrate all 4 constructors and print their manifests.',
      tasks: [
        'Create class CharacterProfile with private fields: String name, String role, int level',
        'Implement full constructor CharacterProfile(String name, String role, int level) with validation: if level < 1, set level = 1',
        'Implement default constructor CharacterProfile() that chains this("Recruit", "Warrior", 1)',
        'Implement CharacterProfile(String name) that chains this(name, "Warrior", 1)',
        'Implement copy constructor CharacterProfile(CharacterProfile other) copying all fields',
        'Implement public String toManifest() returning "[" + role + "] " + name + " - Lv." + level',
        'In main(), create p1 (default), p2 (name "Astra"), p3 (name "Valkyrie", role "Paladin", level 10), and p4 (copy of p3)',
        'Print toManifest() for p1, p2, p3, and p4 on separate lines'
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Read the requirements on the left and write your solution here
        
    }
}

// Define CharacterProfile class here with overloaded constructors
`,
      testCases: [
        {
          id: 'b3_tc1',
          input: '',
          expectedOutput: '[Warrior] Recruit - Lv.1\n[Warrior] Astra - Lv.1\n[Paladin] Valkyrie - Lv.10\n[Paladin] Valkyrie - Lv.10',
          description: 'Validates 4-tier overloaded constructor chaining and manifest output',
        },
      ],
      hints: [
        'Use this(name, "Warrior", 1); inside the single-parameter constructor to delegate to the master constructor.',
        'In copy constructor, read other.name, other.role, other.level.',
      ],
    },
    missions: [
      // --- QUESTION 1 (Coding) ---
      {
        id: 'm3_1',
        levelId: 3,
        number: 1,
        title: 'Task 1: Default vs Parameterized Constructors',
        mode: 'coding_arena',
        storyIntro: 'Awaken recruits and seasoned warriors using overloaded constructors.',
        conceptSummary: 'A class can provide both a no-arg constructor and parameterized constructors to support diverse instantiation scenarios.',
        instructions: 'Create a class Hero with private fields String name and int hp. Provide two constructors: (1) Hero() setting name = "Recruit" and hp = 100, and (2) Hero(String name, int hp) assigning the parameters to the instance fields. Provide a public void display() method printing name + " [HP: " + hp + "]". In main(), create h1 using the default constructor and h2 with ("Astra", 250), then call display() on both.',
        tasks: [
          'Create class Hero with private String name and private int hp',
          'Implement no-argument constructor Hero() setting name="Recruit" and hp=100',
          'Implement parameterized constructor Hero(String name, int hp) using this.name and this.hp',
          'Implement public void display() printing name + " [HP: " + hp + "]"',
          'In main(), instantiate h1 with Hero() and h2 with Hero("Astra", 250)',
          'Call display() on h1 and h2',
        ],
        xpReward: 100,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Write code to test Hero constructors
        
    }
}

class Hero {
    // Declare private fields and overloaded constructors here
    
}
`,
        testCases: [
          {
            id: 'm3_1_tc1',
            input: '',
            expectedOutput: 'Recruit [HP: 100]\nAstra [HP: 250]',
            description: 'Verifies default and parameterized constructor instantiation',
          },
        ],
        hints: ['Use this.name = name; to distinguish parameters from instance fields.'],
        explanation: 'Overloaded constructors allow objects to be initialized with varying levels of detail while keeping internal state consistent.',
      },

      // --- QUESTION 2 (Coding) ---
      {
        id: 'm3_2',
        levelId: 3,
        number: 2,
        title: 'Task 2: Constructor Chaining with this(...)',
        mode: 'coding_arena',
        storyIntro: 'Eliminate duplicate initialization logic by chaining constructors.',
        conceptSummary: 'Constructor chaining via this(...) calls another constructor in the same class. It must be the very first statement.',
        instructions: 'Create class SpellScroll with fields String spellName, int manaCost, and int power. Implement a master constructor SpellScroll(String spellName, int manaCost, int power) that assigns all fields. Implement an overloaded constructor SpellScroll(String spellName) that calls this(spellName, 10, 50). Implement another constructor SpellScroll(String spellName, int power) that calls this(spellName, 25, power). Provide public void describe() printing spellName + " | Mana: " + manaCost + " | Power: " + power. In main(), create s1 using ("Fireball") and s2 using ("Thunderbolt", 120), then call describe() on each.',
        tasks: [
          'Create class SpellScroll with fields String spellName, int manaCost, int power',
          'Implement master constructor SpellScroll(String spellName, int manaCost, int power)',
          'Implement SpellScroll(String spellName) chaining to this(spellName, 10, 50)',
          'Implement SpellScroll(String spellName, int power) chaining to this(spellName, 25, power)',
          'Implement public void describe() printing: spellName + " | Mana: " + manaCost + " | Power: " + power',
          'In main(), instantiate s1 with ("Fireball") and s2 with ("Thunderbolt", 120), then call describe() on both',
        ],
        xpReward: 110,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Instantiate and describe SpellScroll objects
        
    }
}

class SpellScroll {
    // Implement fields, master constructor, and chained constructors
    
}
`,
        testCases: [
          {
            id: 'm3_2_tc1',
            input: '',
            expectedOutput: 'Fireball | Mana: 10 | Power: 50\nThunderbolt | Mana: 25 | Power: 120',
            description: 'Verifies constructor delegation using this(...) syntax',
          },
        ],
        hints: ['The this(...) call must be the first line of the constructor body.'],
        explanation: 'Chaining avoids copy-pasting field validation and initialization logic across multiple constructors.',
      },

      // --- QUESTION 3 (Coding) ---
      {
        id: 'm3_3',
        levelId: 3,
        number: 3,
        title: 'Task 3: Multi-Parameter Coordinate Vectors',
        mode: 'coding_arena',
        storyIntro: 'Construct 3D spatial points with flexible coordinate inputs.',
        conceptSummary: 'Constructors can be overloaded by varying parameter types and counts.',
        instructions: 'Create class Vector3D with double x, double y, double z. Implement three constructors: (1) Vector3D() setting all to 0.0; (2) Vector3D(double val) setting x, y, and z all to val; (3) Vector3D(double x, double y, double z) setting individual coordinates. Provide public void printVector() printing "Vector(" + x + ", " + y + ", " + z + ")". In main(), create v1 with no args, v2 with (5.0), and v3 with (1.5, 2.5, 3.5), then print all three.',
        tasks: [
          'Create class Vector3D with double x, double y, double z',
          'Implement Vector3D() setting x=0.0, y=0.0, z=0.0',
          'Implement Vector3D(double val) assigning val to x, y, z',
          'Implement Vector3D(double x, double y, double z) assigning each coordinate',
          'Implement public void printVector() printing "Vector(" + x + ", " + y + ", " + z + ")"',
          'In main(), create v1, v2, v3 and call printVector() on each',
        ],
        xpReward: 120,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Instantiate vectors and print them
        
    }
}

class Vector3D {
    // Implement Vector3D fields and 3 overloaded constructors
    
}
`,
        testCases: [
          {
            id: 'm3_3_tc1',
            input: '',
            expectedOutput: 'Vector(0.0, 0.0, 0.0)\nVector(5.0, 5.0, 5.0)\nVector(1.5, 2.5, 3.5)',
            description: 'Validates 3 overloaded vector constructors',
          },
        ],
        hints: ['You can chain Vector3D(double val) to this(val, val, val); for clean design.'],
        explanation: 'Overloaded constructors allow flexible geometric and state initialization.',
      },

      // --- QUESTION 4 (Coding) ---
      {
        id: 'm3_4',
        levelId: 3,
        number: 4,
        title: 'Task 4: The Copy Constructor Pattern',
        mode: 'coding_arena',
        storyIntro: 'Duplicate equipment blueprints without creating shared object aliases.',
        conceptSummary: 'A copy constructor takes an object of the same class as a parameter and initializes a new, independent instance with identical fields.',
        instructions: 'Create class Armor with fields String material and int defense. Provide: (1) Parameterized constructor Armor(String material, int defense); (2) Copy constructor Armor(Armor other) which copies other.material and other.defense into the new object. Provide public void printArmor(String label) printing label + ": " + material + " [Def: " + defense + "]". In main(), create original = new Armor("Mithril", 80). Then create copy = new Armor(original). Next, modify original.defense = 95. Call original.printArmor("Original Armor") and copy.printArmor("Copied Armor"). Verify that copy.defense remains 80.',
        tasks: [
          'Create class Armor with String material and int defense',
          'Implement Armor(String material, int defense)',
          'Implement copy constructor Armor(Armor other) copying other.material and other.defense',
          'Implement public void printArmor(String label) printing: label + ": " + material + " [Def: " + defense + "]"',
          'In main(), create original with ("Mithril", 80)',
          'Create copy using new Armor(original)',
          'Change original.defense to 95',
          'Call printArmor on original and copy to prove isolated memory state',
        ],
        xpReward: 130,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Test Armor copy constructor
        
    }
}

class Armor {
    // Implement fields, normal constructor, copy constructor, and printArmor
    
}
`,
        testCases: [
          {
            id: 'm3_4_tc1',
            input: '',
            expectedOutput: 'Original Armor: Mithril [Def: 95]\nCopied Armor: Mithril [Def: 80]',
            description: 'Validates copy constructor creates independent object instances',
          },
        ],
        hints: ['In the copy constructor, assign this.material = other.material; and this.defense = other.defense;'],
        explanation: 'Copy constructors provide an explicit, idiomatically safe way to replicate objects in Java without relying on Object.clone().',
      },

      // --- QUESTION 5 (Coding) ---
      {
        id: 'm3_5',
        levelId: 3,
        number: 5,
        title: 'Task 5: Invariant Validation Across Overloaded Constructors',
        mode: 'coding_arena',
        storyIntro: 'Guard sacred potion potency invariants across all overloaded entry points.',
        conceptSummary: 'By routing all overloaded constructors through one validated master constructor, state integrity rules only need to be written once.',
        instructions: 'Create class Potion with private String type and private int potency. Master constructor Potion(String type, int potency): if potency < 0 set this.potency = 0; if type == null or empty set this.type = "Unknown". Overload 1: Potion() chains this("Health", 50). Overload 2: Potion(int potency) chains this("Mana", potency). Overload 3: Potion(String type, int potency) handles the master logic. Provide public void inspect() printing "Potion: " + type + " (" + potency + ")". In main(), create p1 = new Potion(), p2 = new Potion(-20), p3 = new Potion("Elixir", 100). Call inspect() on all three.',
        tasks: [
          'Create class Potion with private String type and private int potency',
          'Implement master constructor Potion(String type, int potency) with defensive bounds: if potency < 0 potency=0; if type is null/empty type="Unknown"',
          'Implement Potion() chaining to this("Health", 50)',
          'Implement Potion(int potency) chaining to this("Mana", potency)',
          'Implement public void inspect() printing "Potion: " + type + " (" + potency + ")"',
          'In main(), instantiate p1 = new Potion(), p2 = new Potion(-20), and p3 = new Potion("Elixir", 100)',
          'Call inspect() on p1, p2, and p3',
        ],
        xpReward: 140,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Test Potion invariant validation via constructor delegation
        
    }
}

class Potion {
    // Implement Potion fields and chained constructors with validation
    
}
`,
        testCases: [
          {
            id: 'm3_5_tc1',
            input: '',
            expectedOutput: 'Potion: Health (50)\nPotion: Mana (0)\nPotion: Elixir (100)',
            description: 'Validates that constructor chaining enforces invariants across all overloaded forms',
          },
        ],
        hints: ['All constructors should delegate to the master constructor so validation is centralized.'],
        explanation: 'Centralizing validation in the master constructor ensures invalid states cannot sneak in through shortcut constructors.',
      },

      // --- QUESTION 6 (Output Finding) ---
      {
        id: 'm3_6',
        levelId: 3,
        number: 6,
        title: 'Task 6: Predict Output — Constructor Chaining Order',
        mode: 'predict_output',
        storyIntro: 'Trace the stack unwinding of chained this(...) constructors.',
        conceptSummary: 'When constructors chain using this(...), execution drills down to the target constructor first before returning to complete the caller bodies.',
        instructions: 'Carefully trace the Java code below. What is the exact console output produced when new Portal() is executed?',
        xpReward: 100,
        starterCode: `class Portal {
    Portal() {
        this("Olympia");
        System.out.println("No-arg finished");
    }
    Portal(String dest) {
        this(dest, 1);
        System.out.println("Dest finished");
    }
    Portal(String dest, int tier) {
        System.out.println("Core (" + dest + ", " + tier + ") finished");
    }
}

public class Main {
    public static void main(String[] args) {
        new Portal();
    }
}`,
        predictOptions: [
          {
            text: 'Core (Olympia, 1) finished\nDest finished\nNo-arg finished',
            isCorrect: true,
          },
          {
            text: 'No-arg finished\nDest finished\nCore (Olympia, 1) finished',
            isCorrect: false,
          },
          {
            text: 'Dest finished\nCore (Olympia, 1) finished\nNo-arg finished',
            isCorrect: false,
          },
          {
            text: 'Compilation Error: recursive constructor invocation',
            isCorrect: false,
          },
        ],
        hints: ['Remember that this(...) executes before any statements in the current constructor body!'],
        explanation: 'Because this(...) is the very first statement, Portal() immediately delegates to Portal(String), which immediately delegates to Portal(String, int). The core constructor finishes first, then the call stack unwinds in reverse.',
      },

      // --- QUESTION 7 (Output Finding) ---
      {
        id: 'm3_7',
        levelId: 3,
        number: 7,
        title: 'Task 7: Predict Output — Instance Initializer vs Overloaded Constructors',
        mode: 'predict_output',
        storyIntro: 'Analyze when instance initialization blocks { ... } execute relative to chained constructors.',
        conceptSummary: 'An instance initialization block executes only ONCE per new object creation, right after the super() call completes, before any constructor body executes.',
        instructions: 'Determine the exact output produced by instantiating new Relic(42).',
        xpReward: 100,
        starterCode: `class Relic {
    {
        System.out.print("InitBlock ");
    }
    Relic() {
        System.out.print("Default ");
    }
    Relic(int power) {
        this();
        System.out.print("Power:" + power);
    }
}

public class Main {
    public static void main(String[] args) {
        new Relic(42);
    }
}`,
        predictOptions: [
          {
            text: 'InitBlock Default Power:42',
            isCorrect: true,
          },
          {
            text: 'Power:42 InitBlock Default',
            isCorrect: false,
          },
          {
            text: 'InitBlock InitBlock Default Power:42',
            isCorrect: false,
          },
          {
            text: 'Default InitBlock Power:42',
            isCorrect: false,
          },
        ],
        hints: ['Instance blocks execute once when the final delegated constructor reaches its super() completion.'],
        explanation: 'When new Relic(42) calls this(), it delegates to Relic(). Relic() calls super(). After super() finishes, the instance block runs ("InitBlock "), followed by Relic() body ("Default "), and finally Relic(int) body ("Power:42").',
      },

      // --- QUESTION 8 (Output Finding) ---
      {
        id: 'm3_8',
        levelId: 3,
        number: 8,
        title: 'Task 8: Predict Output — Constructor Widening Resolution',
        mode: 'predict_output',
        storyIntro: 'What happens when an integer literal is passed to overloaded constructors accepting long vs double?',
        conceptSummary: 'In Java, primitive widening prefers the narrowest compatible primitive type (int widens to long before int converts to double).',
        instructions: 'Determine the exact console output of the following Java program:',
        xpReward: 100,
        starterCode: `class Gear {
    Gear(long l) {
        System.out.println("long: " + l);
    }
    Gear(double d) {
        System.out.println("double: " + d);
    }
}

public class Main {
    public static void main(String[] args) {
        new Gear(10);
    }
}`,
        predictOptions: [
          {
            text: 'long: 10',
            isCorrect: true,
          },
          {
            text: 'double: 10.0',
            isCorrect: false,
          },
          {
            text: 'Compilation Error: Ambiguous constructor call',
            isCorrect: false,
          },
          {
            text: 'Runtime Exception',
            isCorrect: false,
          },
        ],
        hints: ['Between long and double, which type conversion is closer to int in Java primitive widening hierarchy?'],
        explanation: 'The literal 10 is of type int. Integer widening prefers integer family types (int -> long) before floating-point conversion (int -> double). Therefore, Gear(long) is chosen.',
      },

      // --- QUESTION 9 (Output Finding) ---
      {
        id: 'm3_9',
        levelId: 3,
        number: 9,
        title: 'Task 9: Predict Output — Child Constructor & super() Delegation',
        mode: 'predict_output',
        storyIntro: 'Observe how super() is inserted automatically unless this(...) is used.',
        conceptSummary: 'If a constructor does not explicitly invoke this(...) or super(...), the Java compiler implicitly inserts super() as the first statement.',
        instructions: 'Trace the output when new Sub() is instantiated:',
        xpReward: 100,
        starterCode: `class Base {
    Base() {
        System.out.print("Base ");
    }
}

class Sub extends Base {
    Sub() {
        this(99);
        System.out.print("Sub-0 ");
    }
    Sub(int x) {
        System.out.print("Sub-1(" + x + ") ");
    }
}

public class Main {
    public static void main(String[] args) {
        new Sub();
    }
}`,
        predictOptions: [
          {
            text: 'Base Sub-1(99) Sub-0 ',
            isCorrect: true,
          },
          {
            text: 'Sub-0 Base Sub-1(99) ',
            isCorrect: false,
          },
          {
            text: 'Base Sub-0 Sub-1(99) ',
            isCorrect: false,
          },
          {
            text: 'Base Sub-0 Base Sub-1(99) ',
            isCorrect: false,
          },
        ],
        hints: ['Sub() calls this(99). Sub(int) has no this() or super(), so compiler inserts super(). Base() runs first!'],
        explanation: 'Sub() delegates to Sub(int), which implicitly calls super() (invoking Base constructor). Base prints "Base ", then Sub(99) prints "Sub-1(99) ", and finally Sub() prints "Sub-0 ".',
      },

      // --- QUESTION 10 (Output Finding) ---
      {
        id: 'm3_10',
        levelId: 3,
        number: 10,
        title: 'Task 10: Predict Output — Field Values During Chained Construction',
        mode: 'predict_output',
        storyIntro: 'Predict the value of fields during constructor delegation.',
        conceptSummary: 'Field initializers execute after super() returns, but before the constructor body runs. In constructor chaining, initializers run before the delegated constructor executes.',
        instructions: 'Determine the exact console output of this constructor delegation flow:',
        xpReward: 100,
        starterCode: `class Vault {
    int code = 100;

    Vault() {
        this(50);
        System.out.println("Vault A: " + code);
    }

    Vault(int offset) {
        System.out.println("Vault B: " + code);
        code += offset;
    }
}

public class Main {
    public static void main(String[] args) {
        new Vault();
    }
}`,
        predictOptions: [
          {
            text: 'Vault B: 100\nVault A: 150',
            isCorrect: true,
          },
          {
            text: 'Vault B: 0\nVault A: 100',
            isCorrect: false,
          },
          {
            text: 'Vault A: 100\nVault B: 150',
            isCorrect: false,
          },
          {
            text: 'Vault B: 150\nVault A: 150',
            isCorrect: false,
          },
        ],
        hints: ['Vault() calls Vault(50). When Vault(50) runs, code has already been initialized to 100. It adds 50!'],
        explanation: 'Field initializer `code = 100` executes right after super() finishes. Vault(50) runs first, printing "Vault B: 100" and modifying code to 150. Control returns to Vault(), printing "Vault A: 150".',
      },
    ],
  };

// =========================================================================
// LEVEL 5: METHOD OVERLOADING MASTERY
// =========================================================================
export const METHOD_OVERLOADING_LEVEL: Level = {
    id: 5,
    slug: 'method-overloading',
    title: 'Method Overloading Mastery',
    subtitle: 'Compile-Time Polymorphism, Signature Disambiguation & Overload Resolution',
    realmName: 'The Echoing Colosseum',
    iconName: 'Swords',
    description: 'Master method overloading (static polymorphism) in Java: differentiated parameter types, parameter ordering, varargs precedence, and compile-time overload resolution.',
    topics: [
      'Compile-Time Polymorphism & Static Binding',
      'Overloading by Parameter Count & Type',
      'Parameter Ordering Rules',
      'Primitive Widening vs Autoboxing vs Varargs Hierarchy',
      'Ambiguity Traps with null & Subtypes',
    ],
    story: 'In the Echoing Colosseum, spells and commands share identical incantation names, yet the Arcane Compiler distinguishes their effects based strictly on parameter signatures.',
    totalXP: 1450,
    requiredLevelToUnlock: 5,
    prerequisiteLevelId: 4,
    bossChallenge: {
      title: 'Boss Challenge: The Grand Overload Battle Engine',
      description: 'Implement a comprehensive SpellEngine class with 5 distinct overloaded cast() methods: (1) cast(String spell) returns spell + " cast!"; (2) cast(String spell, int mana) returns spell + " [Mana: " + mana + "]"; (3) cast(String spell, int mana, boolean isCritical) returns spell + " [Mana: " + mana + ", Crit: " + isCritical + "]"; (4) cast(String spell, String target, int mana) returns spell + " targeting " + target + " [Mana: " + mana + "]"; (5) cast(String spell, String[] targets) joining targets with commas returns spell + " hits: " + String.join(", ", targets). In main(), call all 5 methods and print results.',
      tasks: [
        'Create class SpellEngine',
        'Implement public String cast(String spell) returning spell + " cast!"',
        'Implement public String cast(String spell, int mana) returning spell + " [Mana: " + mana + "]"',
        'Implement public String cast(String spell, int mana, boolean isCritical) returning spell + " [Mana: " + mana + ", Crit: " + isCritical + "]"',
        'Implement public String cast(String spell, String target, int mana) returning spell + " targeting " + target + " [Mana: " + mana + "]"',
        'Implement public String cast(String spell, String[] targets) returning spell + " hits: " + String.join(", ", targets)',
        'In main(), instantiate SpellEngine engine = new SpellEngine()',
        'Call and print the outputs of all 5 overloaded cast() methods with provided test inputs',
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Test all 5 overloaded cast() methods
        
    }
}

// Define SpellEngine with 5 overloaded cast() methods
`,
      testCases: [
        {
          id: 'b5_tc1',
          input: '',
          expectedOutput: 'Fireball cast!\nFireball [Mana: 40]\nFireball [Mana: 40, Crit: true]\nFrostbolt targeting Dragon [Mana: 30]\nChain Lightning hits: Goblin, Orc, Troll',
          description: 'Validates 5 distinct overloaded method signatures in SpellEngine',
        },
      ],
      hints: [
        'Use String.join(", ", targets) to format the array of target names cleanly.',
        'Ensure exact spelling and punctuation match the expected outputs.',
      ],
    },
    missions: [
      // --- QUESTION 1 (Coding) ---
      {
        id: 'm5_1',
        levelId: 5,
        number: 1,
        title: 'Task 1: Overloading by Parameter Count',
        mode: 'coding_arena',
        storyIntro: 'Calculate weapon attack damage with optional bonuses.',
        conceptSummary: 'Methods in the same class can share the exact same name as long as their parameter lists differ in count or types.',
        instructions: 'Create class CombatCalculator with three overloaded calculateDamage methods: (1) public int calculateDamage(int baseDamage) returning baseDamage; (2) public int calculateDamage(int baseDamage, int multiplier) returning baseDamage * multiplier; (3) public int calculateDamage(int baseDamage, int multiplier, int elementalBonus) returning (baseDamage * multiplier) + elementalBonus. In main(), instantiate the calculator, call all three with (50), (50, 3), and (50, 3, 25), and print: "Damage 1: " + ..., "Damage 2: " + ..., "Damage 3: " + ...',
        tasks: [
          'Create class CombatCalculator',
          'Implement int calculateDamage(int baseDamage)',
          'Implement int calculateDamage(int baseDamage, int multiplier)',
          'Implement int calculateDamage(int baseDamage, int multiplier, int elementalBonus)',
          'In main(), call all 3 variants and print "Damage 1: [val]", "Damage 2: [val]", "Damage 3: [val]"',
        ],
        xpReward: 100,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Instantiate CombatCalculator and print calculations
        
    }
}

class CombatCalculator {
    // Implement 3 overloaded calculateDamage methods
    
}
`,
        testCases: [
          {
            id: 'm5_1_tc1',
            input: '',
            expectedOutput: 'Damage 1: 50\nDamage 2: 150\nDamage 3: 175',
            description: 'Validates method overloading with varying parameter counts',
          },
        ],
        hints: ['Each calculateDamage method has a unique parameter list, satisfying compile-time polymorphism.'],
        explanation: 'The Java compiler selects the appropriate method at compile time based on the number of arguments passed.',
      },

      // --- QUESTION 2 (Coding) ---
      {
        id: 'm5_2',
        levelId: 5,
        number: 2,
        title: 'Task 2: Overloading by Data Type',
        mode: 'coding_arena',
        storyIntro: 'Build a universal data printer that formats diverse primitive and object types.',
        conceptSummary: 'Overloading allows one unified method name to accept different argument types (int, double, String, boolean).',
        instructions: 'Create class DataPrinter with four overloaded printValue methods: (1) public void printValue(int val) printing "Integer: " + val; (2) public void printValue(double val) printing "Double: " + val; (3) public void printValue(String val) printing "String: " + val; (4) public void printValue(boolean val) printing "Boolean: " + val. In main(), create printer = new DataPrinter() and call printValue with 42, 3.14, "Dragon", and true.',
        tasks: [
          'Create class DataPrinter',
          'Implement printValue(int val)',
          'Implement printValue(double val)',
          'Implement printValue(String val)',
          'Implement printValue(boolean val)',
          'In main(), invoke printValue with 42, 3.14, "Dragon", and true',
        ],
        xpReward: 110,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Test overloaded printValue methods
        
    }
}

class DataPrinter {
    // Implement overloaded printValue methods
    
}
`,
        testCases: [
          {
            id: 'm5_2_tc1',
            input: '',
            expectedOutput: 'Integer: 42\nDouble: 3.14\nString: Dragon\nBoolean: true',
            description: 'Verifies method overloading by parameter type',
          },
        ],
        hints: ['The method names are identical, but each takes a different parameter type.'],
        explanation: 'Type-based overloading is a hallmark of clean Java APIs, providing intuitive, polymorphic interfaces.',
      },

      // --- QUESTION 3 (Coding) ---
      {
        id: 'm5_3',
        levelId: 5,
        number: 3,
        title: 'Task 3: Overloading by Parameter Order',
        mode: 'coding_arena',
        storyIntro: 'Demonstrate that parameter ordering alters method signatures.',
        conceptSummary: 'In Java, two methods can share the same parameter types if their sequence/order in the parameter list is different.',
        instructions: 'Create class GridMapper with two overloaded methods: (1) public void plot(int x, String label) printing "Plotting [" + x + "] as " + label; (2) public void plot(String label, int x) printing "Label " + label + " located at [" + x + "]". In main(), call plot(10, "NorthTower") and plot("SouthGate", 20).',
        tasks: [
          'Create class GridMapper',
          'Implement void plot(int x, String label)',
          'Implement void plot(String label, int x)',
          'In main(), call plot(10, "NorthTower") and plot("SouthGate", 20)',
        ],
        xpReward: 120,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Test plot methods with swapped parameter ordering
        
    }
}

class GridMapper {
    // Implement both plot methods
    
}
`,
        testCases: [
          {
            id: 'm5_3_tc1',
            input: '',
            expectedOutput: 'Plotting [10] as NorthTower\nLabel SouthGate located at [20]',
            description: 'Validates that changing parameter order produces distinct overloaded signatures',
          },
        ],
        hints: ['(int, String) and (String, int) have distinct compiler method signatures.'],
        explanation: 'Parameter sequence is an integral part of the method signature in bytecode.',
      },

      // --- QUESTION 4 (Coding) ---
      {
        id: 'm5_4',
        levelId: 5,
        number: 4,
        title: 'Task 4: Overloading with Varargs',
        mode: 'coding_arena',
        storyIntro: 'Combine fixed-parameter methods with variable-arity methods.',
        conceptSummary: 'A class can overload a fixed-parameter method with a varargs method (...). Exact fixed matches take precedence over varargs.',
        instructions: 'Create class ScoreTracker with: (1) public int addScores(int a, int b) returning a + b; (2) public int addScores(int... scores) looping through scores to calculate and return the total sum. In main(), create tracker = new ScoreTracker(). Print "Pair Score: " + tracker.addScores(10, 20). Print "Multi Score: " + tracker.addScores(5, 15, 25, 35).',
        tasks: [
          'Create class ScoreTracker',
          'Implement int addScores(int a, int b) returning a + b',
          'Implement int addScores(int... scores) looping over the array to return total sum',
          'In main(), call tracker.addScores(10, 20) and print "Pair Score: " + result',
          'Call tracker.addScores(5, 15, 25, 35) and print "Multi Score: " + result',
        ],
        xpReward: 130,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Test ScoreTracker fixed and varargs overloads
        
    }
}

class ScoreTracker {
    // Implement fixed pair overload and varargs overload
    
}
`,
        testCases: [
          {
            id: 'm5_4_tc1',
            input: '',
            expectedOutput: 'Pair Score: 30\nMulti Score: 80',
            description: 'Validates fixed parameters vs varargs overload resolution',
          },
        ],
        hints: ['Use an enhanced for loop (for (int s : scores)) inside the varargs method.'],
        explanation: 'Java prioritizes exact fixed-arity signatures over variable-arity (varargs) signatures during method resolution.',
      },

      // --- QUESTION 5 (Coding) ---
      {
        id: 'm5_5',
        levelId: 5,
        number: 5,
        title: 'Task 5: Overloaded Return Types with Differentiated Signatures',
        mode: 'coding_arena',
        storyIntro: 'Demonstrate how return types may differ when parameter lists differ.',
        conceptSummary: 'In Java, return type alone CANNOT overload a method; however, when parameter signatures differ, the return types are free to differ as well.',
        instructions: 'Create class ParserService with two extract methods: (1) public int extract(String raw) returning Integer.parseInt(raw); (2) public double extract(String raw, double fallback) that attempts to parse raw as double via Double.parseDouble(raw), returning the double, or returning fallback if an exception occurs. In main(), print "Parsed Int: " + parser.extract("250") and "Parsed Double: " + parser.extract("abc", 0.5).',
        tasks: [
          'Create class ParserService',
          'Implement int extract(String raw) using Integer.parseInt(raw)',
          'Implement double extract(String raw, double fallback) parsing double with try-catch fallback',
          'In main(), test parser.extract("250") and print "Parsed Int: " + ...',
          'Test parser.extract("abc", 0.5) and print "Parsed Double: " + ...',
        ],
        xpReward: 140,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Test ParserService overloads with different return types
        
    }
}

class ParserService {
    // Implement extract overloads
    
}
`,
        testCases: [
          {
            id: 'm5_5_tc1',
            input: '',
            expectedOutput: 'Parsed Int: 250\nParsed Double: 0.5',
            description: 'Verifies overloaded methods can have different return types if parameter lists differ',
          },
        ],
        hints: ['Use try { return Double.parseDouble(raw); } catch (Exception e) { return fallback; }'],
        explanation: 'Different return types are completely legal when the parameter lists are differentiated.',
      },

      // --- QUESTION 6 (Output Finding) ---
      {
        id: 'm5_6',
        levelId: 5,
        number: 6,
        title: 'Task 6: Predict Output — Primitive Widening vs Autoboxing',
        mode: 'predict_output',
        storyIntro: 'Analyze Java method resolution hierarchy for primitive arguments.',
        conceptSummary: 'Java method resolution rule: (1) Exact match, (2) Widening primitive, (3) Autoboxing, (4) Varargs. Widening primitive always beats autoboxing.',
        instructions: 'What does the compiler output when an int is passed to overloaded methods accepting long vs Integer?',
        xpReward: 100,
        starterCode: `class OverloadTest {
    void check(long x) {
        System.out.println("long");
    }
    void check(Integer x) {
        System.out.println("Integer");
    }
}

public class Main {
    public static void main(String[] args) {
        int val = 10;
        new OverloadTest().check(val);
    }
}`,
        predictOptions: [
          {
            text: 'long',
            isCorrect: true,
          },
          {
            text: 'Integer',
            isCorrect: false,
          },
          {
            text: 'Compilation Error: Ambiguous method call',
            isCorrect: false,
          },
          {
            text: 'Runtime Exception',
            isCorrect: false,
          },
        ],
        hints: ['Primitive widening was introduced in Java 1.0; autoboxing was added in Java 5. Backward compatibility favors primitive widening.'],
        explanation: 'Java prioritizes widening primitive types (int -> long) before boxing them into wrapper classes (int -> Integer). Thus check(long) is called.',
      },

      // --- QUESTION 7 (Output Finding) ---
      {
        id: 'm5_7',
        levelId: 5,
        number: 7,
        title: 'Task 7: Predict Output — Exact Match vs Widening vs Varargs',
        mode: 'predict_output',
        storyIntro: 'Trace how arguments route between fixed arity and varargs.',
        conceptSummary: 'The compiler prefers exact matches with fixed arguments first. Varargs is only invoked as a last resort when fixed arity does not match.',
        instructions: 'Determine the exact console output of this Dispatcher execution:',
        xpReward: 100,
        starterCode: `class Dispatcher {
    void send(int a, int b) {
        System.out.print("TwoInts ");
    }
    void send(long a, long b) {
        System.out.print("TwoLongs ");
    }
    void send(int... nums) {
        System.out.print("Varargs ");
    }
}

public class Main {
    public static void main(String[] args) {
        Dispatcher d = new Dispatcher();
        d.send(5, 10);
        d.send(5, 10, 15);
    }
}`,
        predictOptions: [
          {
            text: 'TwoInts Varargs ',
            isCorrect: true,
          },
          {
            text: 'TwoLongs Varargs ',
            isCorrect: false,
          },
          {
            text: 'Varargs Varargs ',
            isCorrect: false,
          },
          {
            text: 'TwoInts TwoInts ',
            isCorrect: false,
          },
        ],
        hints: ['d.send(5, 10) matches send(int, int) exactly. d.send(5, 10, 15) has 3 arguments, so only varargs fits.'],
        explanation: 'The call d.send(5, 10) matches the exact fixed-parameter method send(int, int). The three-parameter call cannot match the 2-parameter methods, so it matches send(int... nums). Output is "TwoInts Varargs ".',
      },

      // --- QUESTION 8 (Output Finding) ---
      {
        id: 'm5_8',
        levelId: 5,
        number: 8,
        title: 'Task 8: Predict Output — Most Specific Method Selection with null',
        mode: 'predict_output',
        storyIntro: 'Learn how Java selects between parent and child reference overloads when passing null.',
        conceptSummary: 'When passing null or a reference, the Java compiler chooses the most specific type in the inheritance hierarchy.',
        instructions: 'What is printed by this Inspector program?',
        xpReward: 100,
        starterCode: `class Inspector {
    void inspect(Object o) {
        System.out.println("Object");
    }
    void inspect(String s) {
        System.out.println("String");
    }
}

public class Main {
    public static void main(String[] args) {
        Inspector ins = new Inspector();
        ins.inspect("Hello");
        ins.inspect(null);
    }
}`,
        predictOptions: [
          {
            text: 'String\nString',
            isCorrect: true,
          },
          {
            text: 'String\nObject',
            isCorrect: false,
          },
          {
            text: 'Object\nObject',
            isCorrect: false,
          },
          {
            text: 'Compilation Error: Ambiguous method call for null',
            isCorrect: false,
          },
        ],
        hints: ['String is a subclass of Object. Which type is more specific?'],
        explanation: 'String is a subtype of Object. By Java Language Specification (JLS §15.12.2.5), the compiler chooses the most specific applicable method. Since String is more specific than Object, both "Hello" and null invoke inspect(String).',
      },

      // --- QUESTION 9 (Output Finding) ---
      {
        id: 'm5_9',
        levelId: 5,
        number: 9,
        title: 'Task 9: Predict Output — Resolving Sibling Overload Ambiguity',
        mode: 'predict_output',
        storyIntro: 'Understand why passing un-casted null to sibling types causes compilation failure, and how casting resolves it.',
        conceptSummary: 'If two overloaded methods have parameter types with no inheritance relationship (like String and Integer), passing null directly is ambiguous, but an explicit cast specifies the target.',
        instructions: 'Determine the output of this casted method invocation:',
        xpReward: 100,
        starterCode: `class Ambiguity {
    void test(String s) {
        System.out.println("String");
    }
    void test(Integer i) {
        System.out.println("Integer");
    }
}

public class Main {
    public static void main(String[] args) {
        Ambiguity a = new Ambiguity();
        a.test((String) null);
    }
}`,
        predictOptions: [
          {
            text: 'String',
            isCorrect: true,
          },
          {
            text: 'Integer',
            isCorrect: false,
          },
          {
            text: 'NullPointerException at runtime',
            isCorrect: false,
          },
          {
            text: 'Compilation Error: Cannot cast null to String',
            isCorrect: false,
          },
        ],
        hints: ['The explicit cast (String) null instructs the compiler to match test(String).'],
        explanation: 'Without the cast, a.test(null) would fail compilation with an ambiguous method error because neither String nor Integer is more specific. With (String) null, the compiler uniquely matches test(String).',
      },

      // --- QUESTION 10 (Output Finding) ---
      {
        id: 'm5_10',
        levelId: 5,
        number: 10,
        title: 'Task 10: Predict Output — Compile-Time Static Binding of Overloads',
        mode: 'predict_output',
        storyIntro: 'Witness how method overloading is determined by REFERENCE type, NOT runtime object type.',
        conceptSummary: 'Method OVERLOADING is determined at compile-time by the reference type. Method OVERRIDING is determined at runtime by the object type.',
        instructions: 'What is printed when passing reference c (declared as Creature) holding a Dragon instance?',
        xpReward: 100,
        starterCode: `class Creature {}
class Dragon extends Creature {}

class Hunter {
    void track(Creature c) {
        System.out.print("Creature ");
    }
    void track(Dragon d) {
        System.out.print("Dragon ");
    }
}

public class Main {
    public static void main(String[] args) {
        Creature c = new Dragon();
        Dragon d = new Dragon();
        Hunter h = new Hunter();
        h.track(c);
        h.track(d);
    }
}`,
        predictOptions: [
          {
            text: 'Creature Dragon ',
            isCorrect: true,
          },
          {
            text: 'Dragon Dragon ',
            isCorrect: false,
          },
          {
            text: 'Creature Creature ',
            isCorrect: false,
          },
          {
            text: 'Runtime Error',
            isCorrect: false,
          },
        ],
        hints: ['Overload resolution happens at compile-time. What is the declared static reference type of c?'],
        explanation: 'Overloaded method calls are resolved at compile time based strictly on the declared reference type. Because c is declared as Creature, the compiler binds it to track(Creature). For d, it binds to track(Dragon). Output is "Creature Dragon ".',
      },
    ],
  };

// =========================================================================
// LEVEL 7: METHOD OVERRIDING MASTERY
// =========================================================================
export const METHOD_OVERRIDING_LEVEL: Level = {
    id: 7,
    slug: 'method-overriding',
    title: 'Method Overriding Mastery',
    subtitle: 'Runtime Polymorphism, Dynamic Method Dispatch & Inheritance Contracts',
    realmName: 'The Apex Citadel',
    iconName: 'Building',
    description: 'Master method overriding (runtime polymorphism) in Java: dynamic method dispatch, @Override contract, super method chaining, covariant returns, and distinguishing overriding from hiding.',
    topics: [
      'Runtime Polymorphism & @Override Annotation',
      'Dynamic Method Dispatch (Virtual Tables)',
      'The super Keyword in Method Augmentation',
      'Covariant Return Types',
      'Overriding vs Field Hiding vs Method Hiding',
    ],
    story: 'At the Apex Citadel, elite warriors inherit ancient oaths. Subclasses rewrite combat behaviors at runtime. The JVM dynamically dispatches commands based on the actual living object, not merely its title.',
    totalXP: 1450,
    requiredLevelToUnlock: 7,
    prerequisiteLevelId: 6,
    bossChallenge: {
      title: 'Boss Challenge: The Colosseum Supreme Overriding Arbiter',
      description: 'Construct a 3-tier polymorphic hierarchy: (1) Base class GameEntity with protected String name and int basePower. Provide public String executeAction() returning name + " attacks for " + basePower. (2) Subclass Champion extends GameEntity: override executeAction() to return super.executeAction() + " + Champion Aura". (3) Subclass DragonKnight extends Champion: override executeAction() returning super.executeAction() + " + Dragon Firestrike!". Also, provide covariant method cloneUnit() returning a new instance of the respective type. In main(), store all 3 in a polymorphic array GameEntity[] roster and print their actions.',
      tasks: [
        'Create class GameEntity with constructor GameEntity(String name, int basePower)',
        'Implement public String executeAction() in GameEntity returning name + " attacks for " + basePower',
        'Create class Champion extends GameEntity, chaining super(name, basePower)',
        'Override executeAction() in Champion to return super.executeAction() + " + Champion Aura"',
        'Create class DragonKnight extends Champion, chaining super(name, basePower)',
        'Override executeAction() in DragonKnight to return super.executeAction() + " + Dragon Firestrike!"',
        'In main(), create GameEntity[] roster = { new GameEntity("Scout", 50), new Champion("Arthur", 120), new DragonKnight("Ignis", 300) }',
        'Loop through roster and print each entity.executeAction() on a separate line',
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Implement the polymorphic hierarchy and loop through the array
        
    }
}

// Define GameEntity, Champion, and DragonKnight classes here
`,
      testCases: [
        {
          id: 'b7_tc1',
          input: '',
          expectedOutput: 'Scout attacks for 50\nArthur attacks for 120 + Champion Aura\nIgnis attacks for 300 + Champion Aura + Dragon Firestrike!',
          description: 'Validates 3-tier polymorphic method overriding and super delegation',
        },
      ],
      hints: [
        'DragonKnight calls super.executeAction() which calls Champion\'s executeAction(), which in turn calls GameEntity\'s executeAction()!',
        'Use an enhanced for loop to iterate over GameEntity entity : roster.',
      ],
    },
    missions: [
      // --- QUESTION 1 (Coding) ---
      {
        id: 'm7_1',
        levelId: 7,
        number: 1,
        title: 'Task 1: Runtime Polymorphism with @Override',
        mode: 'coding_arena',
        storyIntro: 'Redefine combat behavior in derived hero classes.',
        conceptSummary: 'When a subclass defines a method with the same name, return type, and parameter list as its parent, it overrides the parent method. The JVM executes the subclass version at runtime.',
        instructions: 'Create base class Warrior with public void attack() printing "Warrior swings basic sword!". Create derived class Paladin extends Warrior that overrides attack() printing "Paladin unleashes Holy Smite!". In main(), declare a Warrior reference pointing to a new Paladin: Warrior w = new Paladin(); Call w.attack(). Observe dynamic method dispatch in action.',
        tasks: [
          'Create class Warrior with public void attack() printing "Warrior swings basic sword!"',
          'Create class Paladin extends Warrior',
          'Override public void attack() in Paladin with @Override printing "Paladin unleashes Holy Smite!"',
          'In main(), create Warrior w = new Paladin()',
          'Call w.attack()',
        ],
        xpReward: 100,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Test runtime polymorphism
        
    }
}

class Warrior {
    // Implement base attack method
    
}

class Paladin extends Warrior {
    // Override attack method
    
}
`,
        testCases: [
          {
            id: 'm7_1_tc1',
            input: '',
            expectedOutput: 'Paladin unleashes Holy Smite!',
            description: 'Validates basic method overriding and dynamic dispatch',
          },
        ],
        hints: ['Use the @Override annotation above the child attack() method to catch signature typos.'],
        explanation: 'Even though the reference variable is of type Warrior, the JVM inspects the heap object at runtime (Paladin) and executes Paladin\'s attack() method.',
      },

      // --- QUESTION 2 (Coding) ---
      {
        id: 'm7_2',
        levelId: 7,
        number: 2,
        title: 'Task 2: Augmenting Parent Behavior with super',
        mode: 'coding_arena',
        storyIntro: 'Enhance base rewards without rewriting core logic.',
        conceptSummary: 'An overriding method can invoke the parent class implementation using super.methodName() to build upon existing functionality.',
        instructions: 'Create class Quest with public int calculateXP() returning 100. Create class BossQuest extends Quest that overrides calculateXP() to return super.calculateXP() + 250. In main(), create Quest q = new Quest() and BossQuest b = new BossQuest(). Print "Standard Quest XP: " + q.calculateXP() and "Boss Quest XP: " + b.calculateXP().',
        tasks: [
          'Create class Quest with public int calculateXP() returning 100',
          'Create class BossQuest extends Quest',
          'Override calculateXP() in BossQuest returning super.calculateXP() + 250',
          'In main(), create q = new Quest() and b = new BossQuest()',
          'Print "Standard Quest XP: " + q.calculateXP() and "Boss Quest XP: " + b.calculateXP()',
        ],
        xpReward: 110,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Test super method augmentation
        
    }
}

class Quest {
    // Implement base calculateXP
    
}

class BossQuest extends Quest {
    // Override calculateXP using super
    
}
`,
        testCases: [
          {
            id: 'm7_2_tc1',
            input: '',
            expectedOutput: 'Standard Quest XP: 100\nBoss Quest XP: 350',
            description: 'Verifies calling superclass method within an overriding method',
          },
        ],
        hints: ['super.calculateXP() executes the parent Quest logic, returning 100.'],
        explanation: 'Using super allows subclasses to extend or decorate behavior rather than completely replacing it.',
      },

      // --- QUESTION 3 (Coding) ---
      {
        id: 'm7_3',
        levelId: 7,
        number: 3,
        title: 'Task 3: Covariant Return Types',
        mode: 'coding_arena',
        storyIntro: 'Return more specific equipment types in specialized armories.',
        conceptSummary: 'Since Java 5, an overriding method is allowed to return a subtype of the return type declared in the parent method. This is called a covariant return type.',
        instructions: 'Create class Weapon with public String getName() returning "Standard Weapon". Create class Excalibur extends Weapon overriding getName() to return "Excalibur, Blade of Kings". Create class Armory with public Weapon forge() returning new Weapon(). Create class LegendaryArmory extends Armory overriding forge() with covariant return type: public Excalibur forge() returning new Excalibur(). In main(), instantiate Armory a1 = new Armory() and LegendaryArmory a2 = new LegendaryArmory(). Call forge().getName() on both and print: "Armory forged: " + ... and "Legendary Armory forged: " + ...',
        tasks: [
          'Create class Weapon with public String getName() returning "Standard Weapon"',
          'Create class Excalibur extends Weapon overriding getName() returning "Excalibur, Blade of Kings"',
          'Create class Armory with public Weapon forge() returning new Weapon()',
          'Create class LegendaryArmory extends Armory overriding public Excalibur forge() returning new Excalibur()',
          'In main(), call forge() on both and print "Armory forged: " + ... and "Legendary Armory forged: " + ...',
        ],
        xpReward: 120,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Test covariant return types
        
    }
}

class Weapon {
    public String getName() { return "Standard Weapon"; }
}

class Excalibur extends Weapon {
    // Override getName
    
}

class Armory {
    public Weapon forge() { return new Weapon(); }
}

class LegendaryArmory extends Armory {
    // Override forge with covariant return type Excalibur
    
}
`,
        testCases: [
          {
            id: 'm7_3_tc1',
            input: '',
            expectedOutput: 'Armory forged: Standard Weapon\nLegendary Armory forged: Excalibur, Blade of Kings',
            description: 'Validates covariant return types in method overriding',
          },
        ],
        hints: ['LegendaryArmory.forge() returns Excalibur, which is a subtype of Weapon.'],
        explanation: 'Covariant return types eliminate the need for callers to cast the returned object to the specialized type.',
      },

      // --- QUESTION 4 (Coding) ---
      {
        id: 'm7_4',
        levelId: 7,
        number: 4,
        title: 'Task 4: Access Modifier Expansion Rules',
        mode: 'coding_arena',
        storyIntro: 'Respect access modifier rules when overriding methods.',
        conceptSummary: 'An overriding method cannot reduce the visibility of the parent method, but it CAN increase visibility (e.g., protected can be broadened to public).',
        instructions: 'Create class BaseDefense with protected void activateShield() printing "Base shield raised". Create class FortressDefense extends BaseDefense that overrides the method with broader visibility: public void activateShield() printing "Fortress impenetrable shield active". In main(), create BaseDefense def = new FortressDefense(); def.activateShield();.',
        tasks: [
          'Create class BaseDefense with protected void activateShield()',
          'Create class FortressDefense extends BaseDefense',
          'Override with public void activateShield() in FortressDefense',
          'In main(), create BaseDefense def = new FortressDefense() and call def.activateShield()',
        ],
        xpReward: 130,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Test expanding access modifier in overriding
        
    }
}

class BaseDefense {
    // Protected method
    
}

class FortressDefense extends BaseDefense {
    // Override with public visibility
    
}
`,
        testCases: [
          {
            id: 'm7_4_tc1',
            input: '',
            expectedOutput: 'Fortress impenetrable shield active',
            description: 'Validates legal expansion of access modifier from protected to public',
          },
        ],
        hints: ['Changing protected to public is legal. Making public to protected would cause a compiler error.'],
        explanation: 'The Liskov Substitution Principle dictates that a child class must honor the contract of its parent. It can never be more restrictive.',
      },

      // --- QUESTION 5 (Coding) ---
      {
        id: 'm7_5',
        levelId: 7,
        number: 5,
        title: 'Task 5: Polymorphic Array & Dynamic Dispatch',
        mode: 'coding_arena',
        storyIntro: 'Command diverse units in a single unified combat roster.',
        conceptSummary: 'Polymorphic arrays store multiple different subclasses under a common superclass reference, enabling runtime dispatch through clean loops.',
        instructions: 'Create base class CombatUnit with public String getRole() returning "Unit". Create three subclasses: (1) Archer returning "Archer"; (2) Mage returning "Mage"; (3) Knight returning "Knight". In main(), create CombatUnit[] roster = { new Archer(), new Mage(), new Knight() };. Loop through the array and print "Deployed: " + unit.getRole() for each unit.',
        tasks: [
          'Create class CombatUnit with public String getRole() returning "Unit"',
          'Create class Archer extends CombatUnit overriding getRole() returning "Archer"',
          'Create class Mage extends CombatUnit overriding getRole() returning "Mage"',
          'Create class Knight extends CombatUnit overriding getRole() returning "Knight"',
          'In main(), create CombatUnit[] roster containing new Archer(), new Mage(), and new Knight()',
          'Loop through the roster and print "Deployed: " + unit.getRole()',
        ],
        xpReward: 140,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Create polymorphic array and iterate
        
    }
}

class CombatUnit {
    // Base class
    
}

// Subclasses Archer, Mage, Knight
`,
        testCases: [
          {
            id: 'm7_5_tc1',
            input: '',
            expectedOutput: 'Deployed: Archer\nDeployed: Mage\nDeployed: Knight',
            description: 'Validates iterating over polymorphic array with dynamic method dispatch',
          },
        ],
        hints: ['Use an enhanced for loop: for (CombatUnit unit : roster) { ... }'],
        explanation: 'Dynamic method dispatch ensures that each element in the array executes its own specific overridden version of getRole().',
      },

      // --- QUESTION 6 (Output Finding) ---
      {
        id: 'm7_6',
        levelId: 7,
        number: 6,
        title: 'Task 6: Predict Output — Dynamic Method Dispatch',
        mode: 'predict_output',
        storyIntro: 'Determine which method executes when a superclass reference points to a child instance.',
        conceptSummary: 'In Java, instance method calls are virtual by default. The actual object type on the heap determines which overridden method executes.',
        instructions: 'What is the console output when parent reference b points to a new Child() instance?',
        xpReward: 100,
        starterCode: `class Parent {
    void shout() {
        System.out.print("Parent ");
    }
}

class Child extends Parent {
    void shout() {
        System.out.print("Child ");
    }
}

public class Main {
    public static void main(String[] args) {
        Parent a = new Parent();
        Parent b = new Child();
        a.shout();
        b.shout();
    }
}`,
        predictOptions: [
          {
            text: 'Parent Child ',
            isCorrect: true,
          },
          {
            text: 'Parent Parent ',
            isCorrect: false,
          },
          {
            text: 'Child Child ',
            isCorrect: false,
          },
          {
            text: 'Compilation Error: Incompatible types',
            isCorrect: false,
          },
        ],
        hints: ['Reference a points to Parent; reference b points to Child. Dynamic dispatch selects Child\'s shout()!'],
        explanation: 'Dynamic dispatch (late binding) looks at the actual runtime object on the heap. Since b points to an instance of Child, Child.shout() is invoked. The output is "Parent Child ".',
      },

      // --- QUESTION 7 (Output Finding) ---
      {
        id: 'm7_7',
        levelId: 7,
        number: 7,
        title: 'Task 7: Predict Output — Overriding vs Field Hiding (The Classic Shadowing Trap)',
        mode: 'predict_output',
        storyIntro: 'Beware: in Java, methods are overridden, but fields are merely HIDDEN (shadowed)!',
        conceptSummary: 'Variables are resolved at compile time based on the REFERENCE type, whereas instance methods are resolved at runtime based on the OBJECT type.',
        instructions: 'Carefully analyze this program. What is the exact output of field access vs method invocation?',
        xpReward: 100,
        starterCode: `class Monster {
    int power = 10;
    void roar() {
        System.out.print("MonsterRoar:" + power + " ");
    }
}

class Dragon extends Monster {
    int power = 50;
    void roar() {
        System.out.print("DragonRoar:" + power + " ");
    }
}

public class Main {
    public static void main(String[] args) {
        Monster m = new Dragon();
        System.out.print("Field:" + m.power + " ");
        m.roar();
    }
}`,
        predictOptions: [
          {
            text: 'Field:10 DragonRoar:50 ',
            isCorrect: true,
          },
          {
            text: 'Field:50 DragonRoar:50 ',
            isCorrect: false,
          },
          {
            text: 'Field:10 MonsterRoar:10 ',
            isCorrect: false,
          },
          {
            text: 'Field:50 MonsterRoar:10 ',
            isCorrect: false,
          },
        ],
        hints: ['m is declared as Monster. Fields do not use dynamic dispatch! Methods do!'],
        explanation: 'In Java, variable binding is compile-time (static). Since m is declared as Monster, m.power accesses Monster.power (10). But m.roar() uses dynamic dispatch, executing Dragon\'s roar() (printing "DragonRoar:50 ").',
      },

      // --- QUESTION 8 (Output Finding) ---
      {
        id: 'm7_8',
        levelId: 7,
        number: 8,
        title: 'Task 8: Predict Output — Multi-Tier super.method() Inheritance Chain',
        mode: 'predict_output',
        storyIntro: 'Trace how super method calls unwind through multiple generations.',
        conceptSummary: 'When each overriding class invokes super.method(), execution cascades up the inheritance tree and prints in order as the stack frames return.',
        instructions: 'Determine the output of calling t.step() on a Tier1 reference holding a Tier3 instance:',
        xpReward: 100,
        starterCode: `class Tier1 {
    void step() {
        System.out.print("T1 ");
    }
}

class Tier2 extends Tier1 {
    void step() {
        super.step();
        System.out.print("T2 ");
    }
}

class Tier3 extends Tier2 {
    void step() {
        super.step();
        System.out.print("T3 ");
    }
}

public class Main {
    public static void main(String[] args) {
        Tier1 t = new Tier3();
        t.step();
    }
}`,
        predictOptions: [
          {
            text: 'T1 T2 T3 ',
            isCorrect: true,
          },
          {
            text: 'T3 T2 T1 ',
            isCorrect: false,
          },
          {
            text: 'T3 ',
            isCorrect: false,
          },
          {
            text: 'T2 T3 ',
            isCorrect: false,
          },
        ],
        hints: ['Tier3.step() calls super.step() first, which calls Tier1.step() first. T1 prints, then T2, then T3.'],
        explanation: 'Tier3.step() calls Tier2.step(), which calls Tier1.step(). Tier1 prints "T1 ", then Tier2 completes and prints "T2 ", and finally Tier3 prints "T3 ". Output is "T1 T2 T3 ".',
      },

      // --- QUESTION 9 (Output Finding) ---
      {
        id: 'm7_9',
        levelId: 7,
        number: 9,
        title: 'Task 9: Predict Output — Static Methods Cannot Be Overridden (Method Hiding)',
        mode: 'predict_output',
        storyIntro: 'Learn why static methods are hidden rather than overridden in Java.',
        conceptSummary: 'Static methods belong to the class, not the instance. Re-declaring a static method in a subclass hides the parent method instead of overriding it. Reference type determines which static method runs.',
        instructions: 'What output is produced by this program testing static method calls?',
        xpReward: 100,
        starterCode: `class BaseBeacon {
    static void ping() {
        System.out.print("BasePing ");
    }
}

class SubBeacon extends BaseBeacon {
    static void ping() {
        System.out.print("SubPing ");
    }
}

public class Main {
    public static void main(String[] args) {
        BaseBeacon b = new SubBeacon();
        b.ping();
        SubBeacon.ping();
    }
}`,
        predictOptions: [
          {
            text: 'BasePing SubPing ',
            isCorrect: true,
          },
          {
            text: 'SubPing SubPing ',
            isCorrect: false,
          },
          {
            text: 'BasePing BasePing ',
            isCorrect: false,
          },
          {
            text: 'Compilation Error: Cannot call static method on reference',
            isCorrect: false,
          },
        ],
        hints: ['b is declared as BaseBeacon. Static method calls are bound at compile-time to the declared reference type.'],
        explanation: 'Static methods do not participate in dynamic dispatch (polymorphism). When calling b.ping(), the compiler resolves it using the static type of b (BaseBeacon), printing "BasePing ". SubBeacon.ping() explicitly calls SubBeacon\'s static method, printing "SubPing ".',
      },

      // --- QUESTION 10 (Output Finding) ---
      {
        id: 'm7_10',
        levelId: 7,
        number: 10,
        title: 'Task 10: Predict Output — Constructor Calling Overridden Method (The Dangerous Trap)',
        mode: 'predict_output',
        storyIntro: 'Uncover the dangerous trap of invoking an overridable method inside a constructor.',
        conceptSummary: 'Never invoke an overridable method inside a constructor! The subclass method runs before the subclass field initializers have executed, exposing default values (like 0 or null).',
        instructions: 'What is printed when new SubClass() is instantiated?',
        xpReward: 100,
        starterCode: `class SuperClass {
    SuperClass() {
        init();
    }
    void init() {
        System.out.println("Super init");
    }
}

class SubClass extends SuperClass {
    int value = 42;

    void init() {
        System.out.println("Sub init value: " + value);
    }
}

public class Main {
    public static void main(String[] args) {
        new SubClass();
    }
}`,
        predictOptions: [
          {
            text: 'Sub init value: 0',
            isCorrect: true,
          },
          {
            text: 'Sub init value: 42',
            isCorrect: false,
          },
          {
            text: 'Super init',
            isCorrect: false,
          },
          {
            text: 'NullPointerException',
            isCorrect: false,
          },
        ],
        hints: ['During SuperClass constructor execution, SubClass fields like value = 42 have NOT been initialized yet! What is the default value of an uninitialized int?'],
        explanation: 'When SubClass is instantiated, SuperClass constructor runs first. It invokes init(). Because of dynamic dispatch, SubClass.init() executes! However, SubClass field initialization (`value = 42`) has not occurred yet, so `value` holds its default JVM value of 0. Thus, "Sub init value: 0" is printed.',
      },
    ],
  };

export const MASTERY_LEVELS: Level[] = [
  CONSTRUCTOR_OVERLOADING_LEVEL,
  METHOD_OVERLOADING_LEVEL,
  METHOD_OVERRIDING_LEVEL,
];

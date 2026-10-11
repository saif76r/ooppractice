export interface JavaRunOutput {
  success: boolean;
  compilationError: string | null;
  runtimeError: string | null;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
}

type JavaValType = 'int' | 'long' | 'double' | 'float' | 'boolean' | 'char' | 'String' | 'null' | 'void' | 'array' | 'object' | 'list' | 'map' | 'set' | 'stringbuilder' | string;

interface JavaVal {
  type: JavaValType;
  value: any;
  className?: string;
}

interface ParamDecl {
  type: string;
  name: string;
}

interface FieldDecl {
  modifiers: string[];
  type: string;
  name: string;
  initExpr?: ExprNode;
}

interface MethodDecl {
  modifiers: string[];
  returnType: string;
  name: string;
  params: ParamDecl[];
  body: StmtNode[] | null;
}

interface ConstructorDecl {
  modifiers: string[];
  name: string;
  params: ParamDecl[];
  body: StmtNode[];
}

interface ClassDecl {
  kind: 'class' | 'interface' | 'enum';
  modifiers: string[];
  name: string;
  superClass: string | null;
  interfaces: string[];
  enumConstants?: string[];
  fields: FieldDecl[];
  constructors: ConstructorDecl[];
  methods: MethodDecl[];
}

type StmtNode =
  | { kind: 'block'; stmts: StmtNode[] }
  | { kind: 'varDecl'; type: string; declarations: { name: string; init?: ExprNode }[] }
  | { kind: 'exprStmt'; expr: ExprNode }
  | { kind: 'if'; cond: ExprNode; thenBranch: StmtNode; elseBranch?: StmtNode }
  | { kind: 'while'; cond: ExprNode; body: StmtNode }
  | { kind: 'doWhile'; body: StmtNode; cond: ExprNode }
  | { kind: 'for'; init?: StmtNode; cond?: ExprNode; update?: ExprNode[]; body: StmtNode }
  | { kind: 'forEach'; type: string; name: string; iterable: ExprNode; body: StmtNode }
  | { kind: 'switch'; expr: ExprNode; cases: { values: (ExprNode | null)[]; stmts: StmtNode[] }[] }
  | { kind: 'return'; expr?: ExprNode }
  | { kind: 'break' }
  | { kind: 'continue' }
  | { kind: 'throw'; expr: ExprNode }
  | { kind: 'try'; tryBlock: StmtNode[]; catches: { type: string; name: string; body: StmtNode[] }[]; finallyBlock?: StmtNode[] }
  | { kind: 'thisCall'; args: ExprNode[] }
  | { kind: 'superCall'; args: ExprNode[] };

type ExprNode =
  | { kind: 'literal'; val: JavaVal }
  | { kind: 'ident'; name: string }
  | { kind: 'this' }
  | { kind: 'super' }
  | { kind: 'binary'; op: string; left: ExprNode; right: ExprNode }
  | { kind: 'unary'; op: string; expr: ExprNode; prefix: boolean }
  | { kind: 'ternary'; cond: ExprNode; thenExpr: ExprNode; elseExpr: ExprNode }
  | { kind: 'assign'; op: string; target: ExprNode; value: ExprNode }
  | { kind: 'member'; object: ExprNode; property: string }
  | { kind: 'index'; array: ExprNode; index: ExprNode }
  | { kind: 'call'; callee: ExprNode; args: ExprNode[] }
  | { kind: 'new'; className: string; typeArgs?: string; args: ExprNode[] }
  | { kind: 'newArray'; elemType: string; size?: ExprNode; initValues?: ExprNode[] }
  | { kind: 'cast'; targetType: string; expr: ExprNode }
  | { kind: 'instanceof'; expr: ExprNode; targetType: string };

interface Token {
  type: 'ident' | 'number' | 'string' | 'char' | 'punct' | 'eof';
  value: string;
  rawNumberType?: 'int' | 'double';
  line: number;
}

class ReturnSignal {
  constructor(public value: JavaVal) {}
}
class BreakSignal {}
class ContinueSignal {}
class JavaExceptionSignal {
  constructor(public exceptionObj: JavaVal, public message: string, public exceptionType: string) {}
}

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let line = 1;

  const multiCharOps = [
    '>>>=', '<<=', '>>=', '>>>', '==', '!=', '<=', '>=', '&&', '||',
    '++', '--', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<', '>>', '->'
  ];

  while (i < code.length) {
    const ch = code[i];

    if (ch === '\n') {
      line++;
      i++;
      continue;
    }
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Single-line comment
    if (ch === '/' && code[i + 1] === '/') {
      i += 2;
      while (i < code.length && code[i] !== '\n') i++;
      continue;
    }

    // Multi-line comment
    if (ch === '/' && code[i + 1] === '*') {
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) {
        if (code[i] === '\n') line++;
        i++;
      }
      i += 2;
      continue;
    }

    // Annotation like @Override
    if (ch === '@') {
      i++;
      while (i < code.length && /[A-Za-z0-9_]/.test(code[i])) i++;
      continue;
    }

    // String literal
    if (ch === '"') {
      let str = '';
      i++;
      while (i < code.length && code[i] !== '"') {
        if (code[i] === '\\') {
          i++;
          const esc = code[i];
          if (esc === 'n') str += '\n';
          else if (esc === 't') str += '\t';
          else if (esc === 'r') str += '\r';
          else if (esc === '"') str += '"';
          else if (esc === '\\') str += '\\';
          else str += esc;
        } else {
          if (code[i] === '\n') line++;
          str += code[i];
        }
        i++;
      }
      if (i >= code.length) {
        throw new Error(`Main.java:${line}: error: unclosed string literal`);
      }
      i++; // closing "
      tokens.push({ type: 'string', value: str, line });
      continue;
    }

    // Char literal
    if (ch === "'") {
      let str = '';
      i++;
      while (i < code.length && code[i] !== "'") {
        if (code[i] === '\\') {
          i++;
          const esc = code[i];
          if (esc === 'n') str += '\n';
          else if (esc === 't') str += '\t';
          else str += esc;
        } else {
          str += code[i];
        }
        i++;
      }
      i++; // closing '
      tokens.push({ type: 'char', value: str, line });
      continue;
    }

    // Number literal
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(code[i + 1] || ''))) {
      let numStr = '';
      let isDouble = false;
      while (i < code.length && /[0-9._]/.test(code[i])) {
        if (code[i] === '.') isDouble = true;
        if (code[i] !== '_') numStr += code[i];
        i++;
      }
      if (i < code.length && /[fFdDlL]/.test(code[i])) {
        const suffix = code[i].toLowerCase();
        if (suffix === 'f' || suffix === 'd') isDouble = true;
        i++;
      }
      tokens.push({
        type: 'number',
        value: numStr,
        rawNumberType: isDouble ? 'double' : 'int',
        line,
      });
      continue;
    }

    // Identifier or keyword
    if (/[A-Za-z_$]/.test(ch)) {
      let id = '';
      while (i < code.length && /[A-Za-z0-9_$]/.test(code[i])) {
        id += code[i];
        i++;
      }
      tokens.push({ type: 'ident', value: id, line });
      continue;
    }

    // Multi-char operators
    let matchedOp = '';
    for (const op of multiCharOps) {
      if (code.startsWith(op, i)) {
        matchedOp = op;
        break;
      }
    }
    if (matchedOp) {
      tokens.push({ type: 'punct', value: matchedOp, line });
      i += matchedOp.length;
      continue;
    }

    // Single-char punctuation
    tokens.push({ type: 'punct', value: ch, line });
    i++;
  }

  tokens.push({ type: 'eof', value: '', line });
  return tokens;
}

const MODIFIERS = new Set([
  'public', 'private', 'protected', 'static', 'final', 'abstract', 'synchronized', 'default', 'native'
]);

const PRIMITIVE_TYPES = new Set([
  'byte', 'short', 'int', 'long', 'float', 'double', 'boolean', 'char', 'void'
]);

class JavaParser {
  private pos = 0;
  constructor(private tokens: Token[]) {}

  private peek(offset = 0): Token {
    return this.tokens[Math.min(this.pos + offset, this.tokens.length - 1)];
  }

  private next(): Token {
    return this.tokens[this.pos++];
  }

  private match(val: string): boolean {
    if (this.peek().value === val) {
      this.pos++;
      return true;
    }
    return false;
  }

  private expect(val: string): Token {
    const tok = this.peek();
    if (tok.value !== val) {
      throw new Error(`Main.java:${tok.line}: error: '${val}' expected, found '${tok.value || 'EOF'}'`);
    }
    return this.next();
  }

  private expectIdent(): string {
    const tok = this.peek();
    if (tok.type !== 'ident') {
      throw new Error(`Main.java:${tok.line}: error: identifier expected, found '${tok.value || 'EOF'}'`);
    }
    return this.next().value;
  }

  public parseProgram(): ClassDecl[] {
    const classes: ClassDecl[] = [];

    while (this.peek().type !== 'eof') {
      if (this.match('package') || this.match('import')) {
        while (this.peek().type !== 'eof' && !this.match(';')) {
          this.next();
        }
        continue;
      }
      if (this.match(';')) continue;
      classes.push(this.parseClassOrInterface());
    }

    return classes;
  }

  private parseModifiers(): string[] {
    const mods: string[] = [];
    while (MODIFIERS.has(this.peek().value)) {
      mods.push(this.next().value);
    }
    return mods;
  }

  private skipTypeArguments(): string {
    if (!this.match('<')) return '';
    let depth = 1;
    let acc = '<';
    while (depth > 0 && this.peek().type !== 'eof') {
      const tok = this.next();
      if (tok.value === '<') depth++;
      else if (tok.value === '>') depth--;
      else if (tok.value === '>>') {
        depth -= 2;
      }
      acc += tok.value;
    }
    return acc;
  }

  private parseType(): string {
    let base = this.expectIdent();
    while (this.match('.')) {
      base += '.' + this.expectIdent();
    }
    if (this.peek().value === '<') {
      this.skipTypeArguments();
    }
    while (this.peek().value === '[' && this.peek(1).value === ']') {
      this.next();
      this.next();
      base += '[]';
    }
    if (this.peek().value === '.' && this.peek(1).value === '.' && this.peek(2).value === '.') {
      this.next();
      this.next();
      this.next();
      base += '[]';
    }
    return base;
  }

  private parseClassOrInterface(): ClassDecl {
    const modifiers = this.parseModifiers();
    let kind: 'class' | 'interface' | 'enum' = 'class';
    if (this.match('class')) kind = 'class';
    else if (this.match('interface')) kind = 'interface';
    else if (this.match('enum')) kind = 'enum';
    else {
      const tok = this.peek();
      throw new Error(`Main.java:${tok.line}: error: class, interface, or enum expected, found '${tok.value}'`);
    }

    const name = this.expectIdent();
    if (this.peek().value === '<') this.skipTypeArguments();

    let superClass: string | null = null;
    const interfaces: string[] = [];

    if (this.match('extends')) {
      if (kind === 'interface') {
        do {
          interfaces.push(this.parseType());
        } while (this.match(','));
      } else {
        superClass = this.parseType();
      }
    }

    if (this.match('implements')) {
      do {
        interfaces.push(this.parseType());
      } while (this.match(','));
    }

    this.expect('{');

    const enumConstants: string[] = [];
    if (kind === 'enum') {
      while (this.peek().type === 'ident') {
        enumConstants.push(this.expectIdent());
        if (this.peek().value === '(') {
          this.next();
          let d = 1;
          while (d > 0 && this.peek().type !== 'eof') {
            const v = this.next().value;
            if (v === '(') d++;
            else if (v === ')') d--;
          }
        }
        if (!this.match(',')) break;
      }
      this.match(';');
    }

    const fields: FieldDecl[] = [];
    const constructors: ConstructorDecl[] = [];
    const methods: MethodDecl[] = [];

    while (this.peek().type !== 'eof' && this.peek().value !== '}') {
      if (this.match(';')) continue;

      // Static initializer or instance initializer block
      if (this.peek().value === '{' || (this.peek().value === 'static' && this.peek(1).value === '{')) {
        if (this.peek().value === 'static') this.next();
        this.parseBlock();
        continue;
      }

      const memberMods = this.parseModifiers();

      // Nested class/interface/enum
      if (this.peek().value === 'class' || this.peek().value === 'interface' || this.peek().value === 'enum') {
        this.parseClassOrInterface();
        continue;
      }

      // Generic method type param <T>
      if (this.peek().value === '<') {
        this.skipTypeArguments();
      }

      // Check if constructor: Ident followed immediately by '(' and Ident === class name
      if (this.peek().type === 'ident' && this.peek().value === name && this.peek(1).value === '(') {
        const ctorName = this.expectIdent();
        const params = this.parseParamList();
        this.skipThrowsClause();
        const body = this.parseBlock();
        constructors.push({ modifiers: memberMods, name: ctorName, params, body });
        continue;
      }

      const memberType = this.parseType();
      const memberName = this.expectIdent();

      if (this.peek().value === '(') {
        // Method declaration
        const params = this.parseParamList();
        this.skipThrowsClause();
        let body: StmtNode[] | null = null;
        if (this.peek().value === '{') {
          body = this.parseBlock();
        } else {
          this.expect(';');
        }
        methods.push({
          modifiers: memberMods,
          returnType: memberType,
          name: memberName,
          params,
          body,
        });
      } else {
        // Field declaration (possibly comma-separated)
        let firstType = memberType;
        while (this.peek().value === '[' && this.peek(1).value === ']') {
          this.next();
          this.next();
          firstType += '[]';
        }
        let firstInit: ExprNode | undefined;
        if (this.match('=')) {
          firstInit = this.parseFieldOrVarInitializer(firstType);
        }
        fields.push({
          modifiers: memberMods,
          type: firstType,
          name: memberName,
          initExpr: firstInit,
        });

        while (this.match(',')) {
          const nextName = this.expectIdent();
          let nextType = memberType;
          while (this.peek().value === '[' && this.peek(1).value === ']') {
            this.next();
            this.next();
            nextType += '[]';
          }
          let nextInit: ExprNode | undefined;
          if (this.match('=')) {
            nextInit = this.parseFieldOrVarInitializer(nextType);
          }
          fields.push({
            modifiers: memberMods,
            type: nextType,
            name: nextName,
            initExpr: nextInit,
          });
        }
        this.expect(';');
      }
    }

    this.expect('}');

    return {
      kind,
      modifiers,
      name,
      superClass,
      interfaces,
      enumConstants,
      fields,
      constructors,
      methods,
    };
  }

  private skipThrowsClause() {
    if (this.match('throws')) {
      do {
        this.parseType();
      } while (this.match(','));
    }
  }

  private parseParamList(): ParamDecl[] {
    this.expect('(');
    const params: ParamDecl[] = [];
    while (this.peek().type !== 'eof' && this.peek().value !== ')') {
      this.parseModifiers();
      let pType = this.parseType();
      const pName = this.expectIdent();
      while (this.peek().value === '[' && this.peek(1).value === ']') {
        this.next();
        this.next();
        pType += '[]';
      }
      params.push({ type: pType, name: pName });
      if (!this.match(',')) break;
    }
    this.expect(')');
    return params;
  }

  private parseFieldOrVarInitializer(declaredType: string): ExprNode {
    if (this.peek().value === '{') {
      this.expect('{');
      const values: ExprNode[] = [];
      while (this.peek().type !== 'eof' && this.peek().value !== '}') {
        values.push(this.parseExpression());
        if (!this.match(',')) break;
      }
      this.expect('}');
      const elemType = declaredType.endsWith('[]') ? declaredType.slice(0, -2) : 'Object';
      return { kind: 'newArray', elemType, initValues: values };
    }
    return this.parseExpression();
  }

  private parseBlock(): StmtNode[] {
    this.expect('{');
    const stmts: StmtNode[] = [];
    while (this.peek().type !== 'eof' && this.peek().value !== '}') {
      if (this.match(';')) continue;
      stmts.push(this.parseStatement());
    }
    this.expect('}');
    return stmts;
  }

  private isLocalVarDecl(): boolean {
    let offset = 0;
    while (MODIFIERS.has(this.peek(offset).value)) {
      offset++;
    }
    const t = this.peek(offset);
    if (t.type !== 'ident') return false;
    if (t.value === 'return' || t.value === 'if' || t.value === 'for' || t.value === 'while' ||
        t.value === 'do' || t.value === 'switch' || t.value === 'try' || t.value === 'throw' ||
        t.value === 'break' || t.value === 'continue' || t.value === 'this' || t.value === 'super' ||
        t.value === 'new') {
      return false;
    }
    if (PRIMITIVE_TYPES.has(t.value)) return true;

    // Look ahead past Type (including generics <...> and array [])
    offset++;
    while (this.peek(offset).value === '.') {
      offset += 2;
    }
    if (this.peek(offset).value === '<') {
      let depth = 1;
      offset++;
      while (depth > 0 && this.peek(offset).type !== 'eof') {
        const v = this.peek(offset).value;
        if (v === '<') depth++;
        else if (v === '>') depth--;
        else if (v === '>>') depth -= 2;
        offset++;
      }
    }
    while (this.peek(offset).value === '[' && this.peek(offset + 1).value === ']') {
      offset += 2;
    }
    return this.peek(offset).type === 'ident';
  }

  private parseStatement(): StmtNode {
    const tok = this.peek();

    if (tok.value === '{') {
      return { kind: 'block', stmts: this.parseBlock() };
    }

    if (this.match('if')) {
      this.expect('(');
      const cond = this.parseExpression();
      this.expect(')');
      const thenBranch = this.parseStatement();
      let elseBranch: StmtNode | undefined;
      if (this.match('else')) {
        elseBranch = this.parseStatement();
      }
      return { kind: 'if', cond, thenBranch, elseBranch };
    }

    if (this.match('while')) {
      this.expect('(');
      const cond = this.parseExpression();
      this.expect(')');
      const body = this.parseStatement();
      return { kind: 'while', cond, body };
    }

    if (this.match('do')) {
      const body = this.parseStatement();
      this.expect('while');
      this.expect('(');
      const cond = this.parseExpression();
      this.expect(')');
      this.expect(';');
      return { kind: 'doWhile', body, cond };
    }

    if (this.match('for')) {
      this.expect('(');
      // Check if enhanced for-each: ( [final] Type ident : expr )
      const savedPos = this.pos;
      try {
        this.parseModifiers();
        const fType = this.parseType();
        const fName = this.expectIdent();
        if (this.match(':')) {
          const iterable = this.parseExpression();
          this.expect(')');
          const body = this.parseStatement();
          return { kind: 'forEach', type: fType, name: fName, iterable, body };
        }
      } catch {
        // Not a forEach, backtrack
      }
      this.pos = savedPos;

      let init: StmtNode | undefined;
      if (!this.match(';')) {
        if (this.isLocalVarDecl()) {
          init = this.parseVarDeclStmt();
        } else {
          const expr = this.parseExpression();
          this.expect(';');
          init = { kind: 'exprStmt', expr };
        }
      }

      let cond: ExprNode | undefined;
      if (!this.match(';')) {
        cond = this.parseExpression();
        this.expect(';');
      }

      const update: ExprNode[] = [];
      if (this.peek().value !== ')') {
        do {
          update.push(this.parseExpression());
        } while (this.match(','));
      }
      this.expect(')');
      const body = this.parseStatement();
      return { kind: 'for', init, cond, update, body };
    }

    if (this.match('switch')) {
      this.expect('(');
      const expr = this.parseExpression();
      this.expect(')');
      this.expect('{');
      const cases: { values: (ExprNode | null)[]; stmts: StmtNode[] }[] = [];
      while (this.peek().type !== 'eof' && this.peek().value !== '}') {
        const values: (ExprNode | null)[] = [];
        while (this.peek().value === 'case' || this.peek().value === 'default') {
          if (this.match('case')) {
            values.push(this.parseExpression());
            this.expect(':');
          } else if (this.match('default')) {
            values.push(null);
            this.expect(':');
          }
        }
        const stmts: StmtNode[] = [];
        while (
          this.peek().type !== 'eof' &&
          this.peek().value !== '}' &&
          this.peek().value !== 'case' &&
          this.peek().value !== 'default'
        ) {
          if (this.match(';')) continue;
          stmts.push(this.parseStatement());
        }
        cases.push({ values, stmts });
      }
      this.expect('}');
      return { kind: 'switch', expr, cases };
    }

    if (this.match('return')) {
      if (this.match(';')) {
        return { kind: 'return' };
      }
      const expr = this.parseExpression();
      this.expect(';');
      return { kind: 'return', expr };
    }

    if (this.match('break')) {
      this.expect(';');
      return { kind: 'break' };
    }

    if (this.match('continue')) {
      this.expect(';');
      return { kind: 'continue' };
    }

    if (this.match('throw')) {
      const expr = this.parseExpression();
      this.expect(';');
      return { kind: 'throw', expr };
    }

    if (this.match('try')) {
      const tryBlock = this.parseBlock();
      const catches: { type: string; name: string; body: StmtNode[] }[] = [];
      while (this.match('catch')) {
        this.expect('(');
        this.parseModifiers();
        let cType = this.parseType();
        while (this.match('|')) {
          this.parseType();
        }
        const cName = this.expectIdent();
        this.expect(')');
        const cBody = this.parseBlock();
        catches.push({ type: cType, name: cName, body: cBody });
      }
      let finallyBlock: StmtNode[] | undefined;
      if (this.match('finally')) {
        finallyBlock = this.parseBlock();
      }
      return { kind: 'try', tryBlock, catches, finallyBlock };
    }

    // Constructor chaining: this(...) or super(...)
    if (this.peek().value === 'this' && this.peek(1).value === '(') {
      this.next();
      const args = this.parseArgs();
      this.expect(';');
      return { kind: 'thisCall', args };
    }

    if (this.peek().value === 'super' && this.peek(1).value === '(') {
      this.next();
      const args = this.parseArgs();
      this.expect(';');
      return { kind: 'superCall', args };
    }

    if (this.isLocalVarDecl()) {
      return this.parseVarDeclStmt();
    }

    const expr = this.parseExpression();
    this.expect(';');
    return { kind: 'exprStmt', expr };
  }

  private parseVarDeclStmt(): StmtNode {
    this.parseModifiers();
    const baseType = this.parseType();
    const declarations: { name: string; init?: ExprNode }[] = [];

    do {
      const varName = this.expectIdent();
      let fullType = baseType;
      while (this.peek().value === '[' && this.peek(1).value === ']') {
        this.next();
        this.next();
        fullType += '[]';
      }
      let init: ExprNode | undefined;
      if (this.match('=')) {
        init = this.parseFieldOrVarInitializer(fullType);
      }
      declarations.push({ name: varName, init });
    } while (this.match(','));

    this.expect(';');
    return { kind: 'varDecl', type: baseType, declarations };
  }

  private parseArgs(): ExprNode[] {
    this.expect('(');
    const args: ExprNode[] = [];
    while (this.peek().type !== 'eof' && this.peek().value !== ')') {
      args.push(this.parseExpression());
      if (!this.match(',')) break;
    }
    this.expect(')');
    return args;
  }

  private parseExpression(): ExprNode {
    return this.parseAssignment();
  }

  private parseAssignment(): ExprNode {
    const left = this.parseTernary();
    const tok = this.peek();
    if (['=', '+=', '-=', '*=', '/=', '%='].includes(tok.value)) {
      const op = this.next().value;
      const value = this.parseAssignment();
      return { kind: 'assign', op, target: left, value };
    }
    return left;
  }

  private parseTernary(): ExprNode {
    const cond = this.parseLogicalOr();
    if (this.match('?')) {
      const thenExpr = this.parseExpression();
      this.expect(':');
      const elseExpr = this.parseTernary();
      return { kind: 'ternary', cond, thenExpr, elseExpr };
    }
    return cond;
  }

  private parseLogicalOr(): ExprNode {
    let left = this.parseLogicalAnd();
    while (this.match('||')) {
      const right = this.parseLogicalAnd();
      left = { kind: 'binary', op: '||', left, right };
    }
    return left;
  }

  private parseLogicalAnd(): ExprNode {
    let left = this.parseBitwiseOr();
    while (this.match('&&')) {
      const right = this.parseBitwiseOr();
      left = { kind: 'binary', op: '&&', left, right };
    }
    return left;
  }

  private parseBitwiseOr(): ExprNode {
    let left = this.parseBitwiseXor();
    while (this.match('|')) {
      const right = this.parseBitwiseXor();
      left = { kind: 'binary', op: '|', left, right };
    }
    return left;
  }

  private parseBitwiseXor(): ExprNode {
    let left = this.parseBitwiseAnd();
    while (this.match('^')) {
      const right = this.parseBitwiseAnd();
      left = { kind: 'binary', op: '^', left, right };
    }
    return left;
  }

  private parseBitwiseAnd(): ExprNode {
    let left = this.parseEquality();
    while (this.match('&')) {
      const right = this.parseEquality();
      left = { kind: 'binary', op: '&', left, right };
    }
    return left;
  }

  private parseEquality(): ExprNode {
    let left = this.parseRelational();
    while (this.peek().value === '==' || this.peek().value === '!=') {
      const op = this.next().value;
      const right = this.parseRelational();
      left = { kind: 'binary', op, left, right };
    }
    return left;
  }

  private parseRelational(): ExprNode {
    let left = this.parseShift();
    while (true) {
      if (this.match('instanceof')) {
        const targetType = this.parseType();
        left = { kind: 'instanceof', expr: left, targetType };
      } else if (['<', '<=', '>', '>='].includes(this.peek().value)) {
        const op = this.next().value;
        const right = this.parseShift();
        left = { kind: 'binary', op, left, right };
      } else {
        break;
      }
    }
    return left;
  }

  private parseShift(): ExprNode {
    let left = this.parseAdditive();
    while (['<<', '>>', '>>>'].includes(this.peek().value)) {
      const op = this.next().value;
      const right = this.parseAdditive();
      left = { kind: 'binary', op, left, right };
    }
    return left;
  }

  private parseAdditive(): ExprNode {
    let left = this.parseMultiplicative();
    while (this.peek().value === '+' || this.peek().value === '-') {
      const op = this.next().value;
      const right = this.parseMultiplicative();
      left = { kind: 'binary', op, left, right };
    }
    return left;
  }

  private parseMultiplicative(): ExprNode {
    let left = this.parseUnary();
    while (['*', '/', '%'].includes(this.peek().value)) {
      const op = this.next().value;
      const right = this.parseUnary();
      left = { kind: 'binary', op, left, right };
    }
    return left;
  }

  private isTypeCastLookahead(): boolean {
    if (this.peek().value !== '(') return false;
    const t1 = this.peek(1);
    if (t1.type !== 'ident') return false;
    if (PRIMITIVE_TYPES.has(t1.value) && this.peek(2).value === ')') {
      return true;
    }
    // Reference type cast: (ClassName) expr where expr starts with ident, this, super, (, new, string, number
    if (this.peek(2).value === ')') {
      const after = this.peek(3);
      if (
        after.type === 'ident' ||
        after.type === 'string' ||
        after.type === 'number' ||
        after.value === '('
      ) {
        return true;
      }
    }
    return false;
  }

  private parseUnary(): ExprNode {
    if (this.isTypeCastLookahead()) {
      this.expect('(');
      const targetType = this.parseType();
      this.expect(')');
      const expr = this.parseUnary();
      return { kind: 'cast', targetType, expr };
    }

    if (['+', '-', '!', '++', '--'].includes(this.peek().value)) {
      const op = this.next().value;
      const expr = this.parseUnary();
      return { kind: 'unary', op, expr, prefix: true };
    }

    return this.parsePostfix();
  }

  private parsePostfix(): ExprNode {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match('.')) {
        const prop = this.expectIdent();
        expr = { kind: 'member', object: expr, property: prop };
      } else if (this.match('[')) {
        const idx = this.parseExpression();
        this.expect(']');
        expr = { kind: 'index', array: expr, index: idx };
      } else if (this.peek().value === '(') {
        const args = this.parseArgs();
        expr = { kind: 'call', callee: expr, args };
      } else if (this.peek().value === '++' || this.peek().value === '--') {
        const op = this.next().value;
        expr = { kind: 'unary', op, expr, prefix: false };
      } else {
        break;
      }
    }

    return expr;
  }

  private parsePrimary(): ExprNode {
    const tok = this.peek();

    if (tok.type === 'number') {
      this.next();
      const numType = tok.rawNumberType || 'int';
      return {
        kind: 'literal',
        val: {
          type: numType,
          value: numType === 'double' ? parseFloat(tok.value) : parseInt(tok.value, 10),
        },
      };
    }

    if (tok.type === 'string') {
      this.next();
      return {
        kind: 'literal',
        val: { type: 'String', value: tok.value },
      };
    }

    if (tok.type === 'char') {
      this.next();
      return {
        kind: 'literal',
        val: { type: 'char', value: tok.value },
      };
    }

    if (this.match('true')) {
      return { kind: 'literal', val: { type: 'boolean', value: true } };
    }

    if (this.match('false')) {
      return { kind: 'literal', val: { type: 'boolean', value: false } };
    }

    if (this.match('null')) {
      return { kind: 'literal', val: { type: 'null', value: null } };
    }

    if (this.match('this')) {
      return { kind: 'this' };
    }

    if (this.match('super')) {
      return { kind: 'super' };
    }

    if (this.match('new')) {
      const className = this.expectIdent();
      let typeArgs = '';
      if (this.peek().value === '<') {
        typeArgs = this.skipTypeArguments();
      }
      if (this.match('[')) {
        if (this.match(']')) {
          this.expect('{');
          const initValues: ExprNode[] = [];
          while (this.peek().type !== 'eof' && this.peek().value !== '}') {
            initValues.push(this.parseExpression());
            if (!this.match(',')) break;
          }
          this.expect('}');
          return { kind: 'newArray', elemType: className, initValues };
        }
        const size = this.parseExpression();
        this.expect(']');
        return { kind: 'newArray', elemType: className, size };
      }
      const args = this.parseArgs();
      return { kind: 'new', className, typeArgs, args };
    }

    if (this.match('(')) {
      const expr = this.parseExpression();
      this.expect(')');
      return expr;
    }

    if (tok.type === 'ident') {
      this.next();
      return { kind: 'ident', name: tok.value };
    }

    throw new Error(`Main.java:${tok.line}: error: illegal start of expression '${tok.value}'`);
  }
}

interface JavaInstance {
  className: string;
  fields: Map<string, JavaVal>;
}

class Scope {
  private vars = new Map<string, JavaVal>();
  constructor(public parent: Scope | null = null) {}

  public declare(name: string, val: JavaVal) {
    this.vars.set(name, val);
  }

  public has(name: string): boolean {
    if (this.vars.has(name)) return true;
    return this.parent ? this.parent.has(name) : false;
  }

  public get(name: string): JavaVal | undefined {
    if (this.vars.has(name)) return this.vars.get(name);
    return this.parent ? this.parent.get(name) : undefined;
  }

  public set(name: string, val: JavaVal): boolean {
    if (this.vars.has(name)) {
      const existing = this.vars.get(name)!;
      this.vars.set(name, coerceToType(val, existing.type));
      return true;
    }
    if (this.parent) return this.parent.set(name, val);
    return false;
  }
}

function defaultForType(type: string): JavaVal {
  if (type === 'int' || type === 'short' || type === 'byte' || type === 'long') {
    return { type: 'int', value: 0 };
  }
  if (type === 'double' || type === 'float') {
    return { type: 'double', value: 0.0 };
  }
  if (type === 'boolean') {
    return { type: 'boolean', value: false };
  }
  if (type === 'char') {
    return { type: 'char', value: '\0' };
  }
  return { type: 'null', value: null, className: type };
}

function coerceToType(val: JavaVal, targetType: string): JavaVal {
  if (targetType === 'int' || targetType === 'long' || targetType === 'short' || targetType === 'byte') {
    if (val.type === 'char') {
      return { type: 'int', value: String(val.value).charCodeAt(0) || 0 };
    }
    return { type: 'int', value: Math.trunc(Number(val.value)) };
  }
  if (targetType === 'double' || targetType === 'float') {
    return { type: 'double', value: Number(val.value) };
  }
  if (targetType === 'boolean') {
    return { type: 'boolean', value: Boolean(val.value) };
  }
  if (targetType === 'String') {
    if (val.type === 'null') return { type: 'null', value: null };
    return { type: 'String', value: formatJavaVal(val) };
  }
  return val;
}

function formatJavaVal(val: JavaVal): string {
  if (!val || val.type === 'null' || val.value === null || val.value === undefined) {
    return 'null';
  }
  if (val.type === 'double' || val.type === 'float') {
    const n = Number(val.value);
    if (Number.isInteger(n)) {
      return n.toFixed(1);
    }
    return String(n);
  }
  if (val.type === 'int' || val.type === 'long' || val.type === 'short' || val.type === 'byte') {
    return String(Math.trunc(Number(val.value)));
  }
  if (val.type === 'boolean') {
    return val.value ? 'true' : 'false';
  }
  if (val.type === 'String' || val.type === 'char') {
    return String(val.value);
  }
  if (val.type === 'list' || val.type === 'set' || val.type === 'array') {
    const arr: JavaVal[] = val.value;
    return '[' + arr.map((x) => formatJavaVal(x)).join(', ') + ']';
  }
  if (val.type === 'map') {
    const map: Map<string, { key: JavaVal; val: JavaVal }> = val.value;
    const entries: string[] = [];
    map.forEach((entry) => {
      entries.push(`${formatJavaVal(entry.key)}=${formatJavaVal(entry.val)}`);
    });
    return '{' + entries.join(', ') + '}';
  }
  if (val.type === 'stringbuilder') {
    return String(val.value.str);
  }
  return String(val.value);
}

export function executeJavaAST(code: string): JavaRunOutput {
  const startTime = Date.now();

  if (!code.includes('class Main')) {
    return {
      success: false,
      compilationError: 'Main.java:1: error: class Main is public, should be declared in a file named Main.java',
      runtimeError: null,
      stdout: '',
      stderr: 'Main.java:1: error: class Main is missing',
      executionTimeMs: Date.now() - startTime,
    };
  }

  let braceDepth = 0;
  for (const ch of code) {
    if (ch === '{') braceDepth++;
    if (ch === '}') braceDepth--;
  }
  if (braceDepth !== 0) {
    return {
      success: false,
      compilationError: 'Main.java: error: reached end of file while parsing (unbalanced curly braces)',
      runtimeError: null,
      stdout: '',
      stderr: 'Main.java: error: reached end of file while parsing',
      executionTimeMs: Date.now() - startTime,
    };
  }

  let classes: ClassDecl[];
  try {
    const tokens = tokenize(code);
    const parser = new JavaParser(tokens);
    classes = parser.parseProgram();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Syntax error';
    return {
      success: false,
      compilationError: msg,
      runtimeError: null,
      stdout: '',
      stderr: msg,
      executionTimeMs: Date.now() - startTime,
    };
  }

  const classMap = new Map<string, ClassDecl>();
  const staticFields = new Map<string, Map<string, JavaVal>>();
  for (const c of classes) {
    classMap.set(c.name, c);
    staticFields.set(c.name, new Map());
  }

  let stdout = '';
  let stepCount = 0;
  const MAX_STEPS = 50000;

  function checkStep() {
    stepCount++;
    if (stepCount > MAX_STEPS) {
      throw new JavaExceptionSignal(
        { type: 'object', value: null, className: 'RuntimeException' },
        'Execution timed out (possible infinite loop)',
        'RuntimeException'
      );
    }
  }

  function isSubTypeOf(subClass: string, targetType: string): boolean {
    if (subClass === targetType || targetType === 'Object') return true;
    const decl = classMap.get(subClass);
    if (!decl) {
      if (targetType === 'Exception' || targetType === 'RuntimeException' || targetType === 'Throwable') {
        return subClass.endsWith('Exception') || subClass.endsWith('Error');
      }
      return false;
    }
    if (decl.superClass && isSubTypeOf(decl.superClass, targetType)) return true;
    for (const iface of decl.interfaces) {
      if (isSubTypeOf(iface, targetType)) return true;
    }
    return false;
  }

  // Score parameter match: null if incompatible, 2 for exact match, 1 for widening/supertype match
  function scoreParamMatch(paramType: string, argVal: JavaVal): number | null {
    const cleanParam = paramType.replace(/<.*>/, '');
    if (argVal.type === 'null') {
      return PRIMITIVE_TYPES.has(cleanParam) ? null : 2;
    }
    if (cleanParam === 'Object') return 1;
    if (cleanParam === 'String') {
      return argVal.type === 'String' ? 2 : null;
    }
    if (cleanParam === 'boolean' || cleanParam === 'Boolean') {
      return argVal.type === 'boolean' ? 2 : null;
    }
    if (cleanParam === 'char' || cleanParam === 'Character') {
      return argVal.type === 'char' ? 2 : null;
    }
    if (cleanParam === 'int' || cleanParam === 'Integer' || cleanParam === 'long' || cleanParam === 'short' || cleanParam === 'byte') {
      if (argVal.type === 'int' || argVal.type === 'long') return 2;
      if (argVal.type === 'char') return 1;
      return null;
    }
    if (cleanParam === 'double' || cleanParam === 'Double' || cleanParam === 'float' || cleanParam === 'Float') {
      if (argVal.type === 'double' || argVal.type === 'float') return 2;
      if (argVal.type === 'int' || argVal.type === 'long') return 1; // widening int -> double
      return null;
    }
    if (cleanParam.endsWith('[]')) {
      return argVal.type === 'array' ? 2 : null;
    }
    if (cleanParam === 'List' || cleanParam === 'ArrayList') {
      return argVal.type === 'list' ? 2 : null;
    }
    if (cleanParam === 'Map' || cleanParam === 'HashMap') {
      return argVal.type === 'map' ? 2 : null;
    }
    if (cleanParam === 'Set' || cleanParam === 'HashSet') {
      return argVal.type === 'set' ? 2 : null;
    }
    if (argVal.type === 'object' && argVal.className) {
      if (argVal.className === cleanParam) return 2;
      if (isSubTypeOf(argVal.className, cleanParam)) return 1;
    }
    return null;
  }

  function selectBestOverload<T extends { params: ParamDecl[] }>(candidates: T[], args: JavaVal[]): T | null {
    const arityMatches = candidates.filter((c) => c.params.length === args.length);
    let best: T | null = null;
    let bestScore = -1;

    for (const cand of arityMatches) {
      let score = 0;
      let compatible = true;
      for (let i = 0; i < args.length; i++) {
        const s = scoreParamMatch(cand.params[i].type, args[i]);
        if (s === null) {
          compatible = false;
          break;
        }
        score += s;
      }
      if (compatible && score > bestScore) {
        bestScore = score;
        best = cand;
      }
    }
    return best;
  }

  function findMethod(className: string, methodName: string, args: JavaVal[]): { decl: MethodDecl; ownerClass: string } | null {
    let curr: string | null = className;
    while (curr) {
      const cDecl = classMap.get(curr);
      if (!cDecl) break;
      const candidates = cDecl.methods.filter((m) => m.name === methodName && m.body !== null);
      const best = selectBestOverload(candidates, args);
      if (best) return { decl: best, ownerClass: curr };

      // Check default methods on interfaces
      for (const ifaceName of cDecl.interfaces) {
        const ifaceDecl = classMap.get(ifaceName);
        if (ifaceDecl) {
          const iCandidates = ifaceDecl.methods.filter((m) => m.name === methodName && m.body !== null);
          const iBest = selectBestOverload(iCandidates, args);
          if (iBest) return { decl: iBest, ownerClass: ifaceName };
        }
      }

      curr = cDecl.superClass;
    }
    return null;
  }

  function initInstanceFields(instance: JavaInstance, className: string) {
    const cDecl = classMap.get(className);
    if (!cDecl) return;
    if (cDecl.superClass) {
      initInstanceFields(instance, cDecl.superClass);
    }
    const scope = new Scope();
    for (const f of cDecl.fields) {
      if (f.modifiers.includes('static')) continue;
      const val = f.initExpr ? coerceToType(evalExpr(f.initExpr, scope, instance, className), f.type) : defaultForType(f.type);
      instance.fields.set(f.name, val);
    }
  }

  function invokeConstructor(instance: JavaInstance, className: string, args: JavaVal[]) {
    const cDecl = classMap.get(className);
    if (!cDecl) {
      // Built-in or custom exception fallback
      if (args.length > 0) {
        instance.fields.set('message', coerceToType(args[0], 'String'));
      }
      return;
    }

    if (cDecl.constructors.length === 0) {
      if (cDecl.superClass) {
        invokeConstructor(instance, cDecl.superClass, []);
      }
      return;
    }

    const ctor = selectBestOverload(cDecl.constructors, args);
    if (!ctor) {
      throw new Error(`Main.java: error: no suitable constructor found for ${className}(${args.map((a) => a.type).join(', ')})`);
    }

    const scope = new Scope();
    for (let i = 0; i < ctor.params.length; i++) {
      scope.declare(ctor.params[i].name, coerceToType(args[i], ctor.params[i].type));
    }

    let stmts = ctor.body;
    const firstStmt = stmts[0];
    if (firstStmt && firstStmt.kind === 'thisCall') {
      const chainedArgs = firstStmt.args.map((a) => evalExpr(a, scope, instance, className));
      invokeConstructor(instance, className, chainedArgs);
      stmts = stmts.slice(1);
    } else if (firstStmt && firstStmt.kind === 'superCall') {
      const superArgs = firstStmt.args.map((a) => evalExpr(a, scope, instance, className));
      if (cDecl.superClass) {
        invokeConstructor(instance, cDecl.superClass, superArgs);
      } else {
        // E.g. extending RuntimeException / Exception
        if (superArgs.length > 0) {
          instance.fields.set('message', coerceToType(superArgs[0], 'String'));
        }
      }
      stmts = stmts.slice(1);
    } else if (cDecl.superClass) {
      invokeConstructor(instance, cDecl.superClass, []);
    }

    try {
      execBlock(stmts, scope, instance, className);
    } catch (sig) {
      if (sig instanceof ReturnSignal) return;
      throw sig;
    }
  }

  function invokeMethod(
    instance: JavaInstance | null,
    className: string,
    methodName: string,
    args: JavaVal[]
  ): JavaVal {
    checkStep();

    // Built-in Exception methods
    if (instance && (methodName === 'getMessage') && instance.fields.has('message')) {
      return instance.fields.get('message')!;
    }

    const found = findMethod(className, methodName, args);
    if (!found || !found.decl.body) {
      // Check Object.toString() default
      if (instance && methodName === 'toString' && args.length === 0) {
        return { type: 'String', value: `${instance.className}@1` };
      }
      throw new Error(`Main.java: error: cannot find symbol method ${methodName}(${args.map((a) => a.type).join(', ')}) in class ${className}`);
    }

    const { decl, ownerClass } = found;
    const methodScope = new Scope();
    for (let i = 0; i < decl.params.length; i++) {
      methodScope.declare(decl.params[i].name, coerceToType(args[i], decl.params[i].type));
    }

    try {
      execBlock(decl.body, methodScope, instance, ownerClass);
    } catch (sig) {
      if (sig instanceof ReturnSignal) {
        return decl.returnType === 'void' ? { type: 'void', value: undefined } : coerceToType(sig.value, decl.returnType);
      }
      throw sig;
    }

    return { type: 'void', value: undefined };
  }

  function execBlock(stmts: StmtNode[], scope: Scope, thisObj: JavaInstance | null, currentClass: string) {
    for (const stmt of stmts) {
      execStmt(stmt, scope, thisObj, currentClass);
    }
  }

  function execStmt(stmt: StmtNode, scope: Scope, thisObj: JavaInstance | null, currentClass: string) {
    checkStep();

    switch (stmt.kind) {
      case 'block': {
        const childScope = new Scope(scope);
        execBlock(stmt.stmts, childScope, thisObj, currentClass);
        break;
      }
      case 'varDecl': {
        for (const decl of stmt.declarations) {
          const val = decl.init
            ? coerceToType(evalExpr(decl.init, scope, thisObj, currentClass), stmt.type)
            : defaultForType(stmt.type);
          scope.declare(decl.name, val);
        }
        break;
      }
      case 'exprStmt': {
        evalExpr(stmt.expr, scope, thisObj, currentClass);
        break;
      }
      case 'if': {
        const c = evalExpr(stmt.cond, scope, thisObj, currentClass);
        if (c.value) {
          execStmt(stmt.thenBranch, new Scope(scope), thisObj, currentClass);
        } else if (stmt.elseBranch) {
          execStmt(stmt.elseBranch, new Scope(scope), thisObj, currentClass);
        }
        break;
      }
      case 'while': {
        while (evalExpr(stmt.cond, scope, thisObj, currentClass).value) {
          checkStep();
          try {
            execStmt(stmt.body, new Scope(scope), thisObj, currentClass);
          } catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) continue;
            throw sig;
          }
        }
        break;
      }
      case 'doWhile': {
        do {
          checkStep();
          try {
            execStmt(stmt.body, new Scope(scope), thisObj, currentClass);
          } catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) continue;
            throw sig;
          }
        } while (evalExpr(stmt.cond, scope, thisObj, currentClass).value);
        break;
      }
      case 'for': {
        const forScope = new Scope(scope);
        if (stmt.init) execStmt(stmt.init, forScope, thisObj, currentClass);
        while (!stmt.cond || evalExpr(stmt.cond, forScope, thisObj, currentClass).value) {
          checkStep();
          try {
            execStmt(stmt.body, new Scope(forScope), thisObj, currentClass);
          } catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) {
              // proceed to update
            } else {
              throw sig;
            }
          }
          if (stmt.update) {
            for (const u of stmt.update) {
              evalExpr(u, forScope, thisObj, currentClass);
            }
          }
        }
        break;
      }
      case 'forEach': {
        const iterVal = evalExpr(stmt.iterable, scope, thisObj, currentClass);
        let items: JavaVal[] = [];
        if (iterVal.type === 'array' || iterVal.type === 'list' || iterVal.type === 'set') {
          items = iterVal.value;
        }
        for (const item of items) {
          checkStep();
          const loopScope = new Scope(scope);
          loopScope.declare(stmt.name, coerceToType(item, stmt.type));
          try {
            execStmt(stmt.body, loopScope, thisObj, currentClass);
          } catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) continue;
            throw sig;
          }
        }
        break;
      }
      case 'switch': {
        const target = evalExpr(stmt.expr, scope, thisObj, currentClass);
        let matched = false;
        const switchScope = new Scope(scope);
        try {
          for (const c of stmt.cases) {
            if (!matched) {
              for (const v of c.values) {
                if (v === null) {
                  matched = true;
                  break;
                }
                const caseVal = evalExpr(v, switchScope, thisObj, currentClass);
                if (caseVal.value === target.value) {
                  matched = true;
                  break;
                }
              }
            }
            if (matched) {
              execBlock(c.stmts, switchScope, thisObj, currentClass);
            }
          }
        } catch (sig) {
          if (!(sig instanceof BreakSignal)) throw sig;
        }
        break;
      }
      case 'return': {
        const val = stmt.expr ? evalExpr(stmt.expr, scope, thisObj, currentClass) : { type: 'void', value: undefined };
        throw new ReturnSignal(val);
      }
      case 'break':
        throw new BreakSignal();
      case 'continue':
        throw new ContinueSignal();
      case 'throw': {
        const exVal = evalExpr(stmt.expr, scope, thisObj, currentClass);
        let msg = '';
        let exType = exVal.className || 'Exception';
        if (exVal.type === 'object' && exVal.value) {
          const inst = exVal.value as JavaInstance;
          exType = inst.className;
          const m = inst.fields.get('message');
          if (m) msg = formatJavaVal(m);
        }
        throw new JavaExceptionSignal(exVal, msg, exType);
      }
      case 'try': {
        try {
          execBlock(stmt.tryBlock, new Scope(scope), thisObj, currentClass);
        } catch (sig) {
          if (sig instanceof JavaExceptionSignal) {
            let handled = false;
            for (const c of stmt.catches) {
              if (
                c.type === 'Exception' ||
                c.type === 'RuntimeException' ||
                c.type === 'Throwable' ||
                c.type === sig.exceptionType ||
                isSubTypeOf(sig.exceptionType, c.type)
              ) {
                const catchScope = new Scope(scope);
                catchScope.declare(c.name, sig.exceptionObj);
                execBlock(c.body, catchScope, thisObj, currentClass);
                handled = true;
                break;
              }
            }
            if (!handled) throw sig;
          } else {
            throw sig;
          }
        } finally {
          if (stmt.finallyBlock) {
            execBlock(stmt.finallyBlock, new Scope(scope), thisObj, currentClass);
          }
        }
        break;
      }
    }
  }

  function resolveIdentifier(name: string, scope: Scope, thisObj: JavaInstance | null, currentClass: string): JavaVal {
    const local = scope.get(name);
    if (local !== undefined) return local;

    if (thisObj && thisObj.fields.has(name)) {
      return thisObj.fields.get(name)!;
    }

    const sf = staticFields.get(currentClass);
    if (sf && sf.has(name)) {
      return sf.get(name)!;
    }

    // Could be a class name reference (e.g., System, Math, Integer, or user class)
    if (classMap.has(name) || ['System', 'Math', 'Integer', 'Double', 'Boolean', 'String', 'Arrays', 'Collections'].includes(name)) {
      return { type: 'classRef', value: name };
    }

    throw new Error(`Main.java: error: cannot find symbol variable ${name}`);
  }

  function assignTarget(
    target: ExprNode,
    op: string,
    rhs: JavaVal,
    scope: Scope,
    thisObj: JavaInstance | null,
    currentClass: string
  ): JavaVal {
    const applyOp = (cur: JavaVal, right: JavaVal): JavaVal => {
      if (op === '=') return right;
      const binOp = op.slice(0, -1);
      return evalBinary(binOp, cur, right);
    };

    if (target.kind === 'ident') {
      if (scope.has(target.name)) {
        const cur = scope.get(target.name)!;
        const nextVal = applyOp(cur, rhs);
        scope.set(target.name, nextVal);
        return scope.get(target.name)!;
      }
      if (thisObj && thisObj.fields.has(target.name)) {
        const cur = thisObj.fields.get(target.name)!;
        const nextVal = coerceToType(applyOp(cur, rhs), cur.type);
        thisObj.fields.set(target.name, nextVal);
        return nextVal;
      }
      const sf = staticFields.get(currentClass);
      if (sf && sf.has(target.name)) {
        const cur = sf.get(target.name)!;
        const nextVal = coerceToType(applyOp(cur, rhs), cur.type);
        sf.set(target.name, nextVal);
        return nextVal;
      }
      throw new Error(`Main.java: error: cannot find symbol variable ${target.name}`);
    }

    if (target.kind === 'member') {
      const obj = evalExpr(target.object, scope, thisObj, currentClass);
      if (obj.type === 'classRef') {
        const sf = staticFields.get(obj.value);
        if (sf && sf.has(target.property)) {
          const cur = sf.get(target.property)!;
          const nextVal = coerceToType(applyOp(cur, rhs), cur.type);
          sf.set(target.property, nextVal);
          return nextVal;
        }
      }
      if (obj.type === 'object' && obj.value) {
        const inst = obj.value as JavaInstance;
        const cur = inst.fields.get(target.property) || { type: rhs.type, value: null };
        const nextVal = coerceToType(applyOp(cur, rhs), cur.type);
        inst.fields.set(target.property, nextVal);
        return nextVal;
      }
      throw new JavaExceptionSignal(
        { type: 'object', value: null, className: 'NullPointerException' },
        `Cannot assign field "${target.property}" on null`,
        'NullPointerException'
      );
    }

    if (target.kind === 'index') {
      const arr = evalExpr(target.array, scope, thisObj, currentClass);
      const idx = evalExpr(target.index, scope, thisObj, currentClass);
      const i = Math.trunc(Number(idx.value));
      if (arr.type === 'array') {
        const list = arr.value as JavaVal[];
        const cur = list[i];
        const nextVal = applyOp(cur, rhs);
        list[i] = nextVal;
        return nextVal;
      }
    }

    throw new Error('Main.java: error: invalid assignment target');
  }

  function evalBinary(op: string, l: JavaVal, r: JavaVal): JavaVal {
    if (op === '+') {
      if (l.type === 'String' || r.type === 'String') {
        return { type: 'String', value: formatJavaVal(l) + formatJavaVal(r) };
      }
      const isDouble = l.type === 'double' || l.type === 'float' || r.type === 'double' || r.type === 'float';
      const sum = Number(l.value) + Number(r.value);
      return { type: isDouble ? 'double' : 'int', value: isDouble ? sum : Math.trunc(sum) };
    }
    if (op === '-') {
      const isDouble = l.type === 'double' || l.type === 'float' || r.type === 'double' || r.type === 'float';
      const diff = Number(l.value) - Number(r.value);
      return { type: isDouble ? 'double' : 'int', value: isDouble ? diff : Math.trunc(diff) };
    }
    if (op === '*') {
      const isDouble = l.type === 'double' || l.type === 'float' || r.type === 'double' || r.type === 'float';
      const prod = Number(l.value) * Number(r.value);
      return { type: isDouble ? 'double' : 'int', value: isDouble ? prod : Math.trunc(prod) };
    }
    if (op === '/') {
      const isDouble = l.type === 'double' || l.type === 'float' || r.type === 'double' || r.type === 'float';
      if (!isDouble && Number(r.value) === 0) {
        throw new JavaExceptionSignal(
          { type: 'object', value: null, className: 'ArithmeticException' },
          '/ by zero',
          'ArithmeticException'
        );
      }
      const quot = Number(l.value) / Number(r.value);
      return { type: isDouble ? 'double' : 'int', value: isDouble ? quot : Math.trunc(quot) };
    }
    if (op === '%') {
      const isDouble = l.type === 'double' || l.type === 'float' || r.type === 'double' || r.type === 'float';
      const rem = Number(l.value) % Number(r.value);
      return { type: isDouble ? 'double' : 'int', value: isDouble ? rem : Math.trunc(rem) };
    }
    if (op === '==') return { type: 'boolean', value: l.value === r.value };
    if (op === '!=') return { type: 'boolean', value: l.value !== r.value };
    if (op === '<') return { type: 'boolean', value: Number(l.value) < Number(r.value) };
    if (op === '<=') return { type: 'boolean', value: Number(l.value) <= Number(r.value) };
    if (op === '>') return { type: 'boolean', value: Number(l.value) > Number(r.value) };
    if (op === '>=') return { type: 'boolean', value: Number(l.value) >= Number(r.value) };
    if (op === '&') return { type: 'int', value: Number(l.value) & Number(r.value) };
    if (op === '|') return { type: 'int', value: Number(l.value) | Number(r.value) };
    if (op === '^') return { type: 'int', value: Number(l.value) ^ Number(r.value) };
    if (op === '<<') return { type: 'int', value: Number(l.value) << Number(r.value) };
    if (op === '>>') return { type: 'int', value: Number(l.value) >> Number(r.value) };
    return { type: 'int', value: 0 };
  }

  function evalExpr(expr: ExprNode, scope: Scope, thisObj: JavaInstance | null, currentClass: string): JavaVal {
    switch (expr.kind) {
      case 'literal':
        return expr.val;

      case 'this':
        return { type: 'object', value: thisObj, className: thisObj?.className || currentClass };

      case 'super':
        return {
          type: 'superRef',
          value: thisObj,
          className: classMap.get(currentClass)?.superClass || 'Object',
        };

      case 'ident':
        return resolveIdentifier(expr.name, scope, thisObj, currentClass);

      case 'binary': {
        if (expr.op === '&&') {
          const l = evalExpr(expr.left, scope, thisObj, currentClass);
          if (!l.value) return { type: 'boolean', value: false };
          const r = evalExpr(expr.right, scope, thisObj, currentClass);
          return { type: 'boolean', value: Boolean(r.value) };
        }
        if (expr.op === '||') {
          const l = evalExpr(expr.left, scope, thisObj, currentClass);
          if (l.value) return { type: 'boolean', value: true };
          const r = evalExpr(expr.right, scope, thisObj, currentClass);
          return { type: 'boolean', value: Boolean(r.value) };
        }
        const l = evalExpr(expr.left, scope, thisObj, currentClass);
        const r = evalExpr(expr.right, scope, thisObj, currentClass);
        return evalBinary(expr.op, l, r);
      }

      case 'unary': {
        if (expr.op === '++' || expr.op === '--') {
          const cur = evalExpr(expr.expr, scope, thisObj, currentClass);
          const delta = expr.op === '++' ? 1 : -1;
          const updated: JavaVal = {
            type: cur.type,
            value: cur.type === 'double' ? Number(cur.value) + delta : Math.trunc(Number(cur.value)) + delta,
          };
          assignTarget(expr.expr, '=', updated, scope, thisObj, currentClass);
          return expr.prefix ? updated : cur;
        }
        const v = evalExpr(expr.expr, scope, thisObj, currentClass);
        if (expr.op === '-') {
          return { type: v.type, value: -Number(v.value) };
        }
        if (expr.op === '+') {
          return { type: v.type, value: +Number(v.value) };
        }
        if (expr.op === '!') {
          return { type: 'boolean', value: !v.value };
        }
        return v;
      }

      case 'ternary': {
        const c = evalExpr(expr.cond, scope, thisObj, currentClass);
        return c.value
          ? evalExpr(expr.thenExpr, scope, thisObj, currentClass)
          : evalExpr(expr.elseExpr, scope, thisObj, currentClass);
      }

      case 'assign': {
        const rhs = evalExpr(expr.value, scope, thisObj, currentClass);
        return assignTarget(expr.target, expr.op, rhs, scope, thisObj, currentClass);
      }

      case 'cast': {
        const val = evalExpr(expr.expr, scope, thisObj, currentClass);
        return coerceToType(val, expr.targetType);
      }

      case 'instanceof': {
        const val = evalExpr(expr.expr, scope, thisObj, currentClass);
        if (val.type === 'null' || !val.value) return { type: 'boolean', value: false };
        if (val.type === 'String' && expr.targetType === 'String') return { type: 'boolean', value: true };
        if (val.type === 'object' && val.className) {
          return { type: 'boolean', value: isSubTypeOf(val.className, expr.targetType) };
        }
        return { type: 'boolean', value: false };
      }

      case 'member': {
        const obj = evalExpr(expr.object, scope, thisObj, currentClass);
        if (obj.type === 'classRef') {
          if (obj.value === 'System' && expr.property === 'out') {
            return { type: 'systemOut', value: 'System.out' };
          }
          if (obj.value === 'Math' && expr.property === 'PI') {
            return { type: 'double', value: Math.PI };
          }
          if (obj.value === 'Integer' && expr.property === 'MAX_VALUE') {
            return { type: 'int', value: 2147483647 };
          }
          if (obj.value === 'Integer' && expr.property === 'MIN_VALUE') {
            return { type: 'int', value: -2147483648 };
          }
          const sf = staticFields.get(obj.value);
          if (sf && sf.has(expr.property)) {
            return sf.get(expr.property)!;
          }
          const cDecl = classMap.get(obj.value);
          if (cDecl && cDecl.kind === 'enum' && cDecl.enumConstants?.includes(expr.property)) {
            return { type: 'String', value: expr.property, className: obj.value };
          }
        }
        if (obj.type === 'array' && expr.property === 'length') {
          return { type: 'int', value: (obj.value as JavaVal[]).length };
        }
        if (obj.type === 'object' && obj.value) {
          const inst = obj.value as JavaInstance;
          if (inst.fields.has(expr.property)) {
            return inst.fields.get(expr.property)!;
          }
        }
        throw new JavaExceptionSignal(
          { type: 'object', value: null, className: 'NullPointerException' },
          `Cannot read field "${expr.property}"`,
          'NullPointerException'
        );
      }

      case 'index': {
        const arr = evalExpr(expr.array, scope, thisObj, currentClass);
        const idx = evalExpr(expr.index, scope, thisObj, currentClass);
        const i = Math.trunc(Number(idx.value));
        if (arr.type === 'array') {
          const list = arr.value as JavaVal[];
          if (i < 0 || i >= list.length) {
            throw new JavaExceptionSignal(
              { type: 'object', value: null, className: 'ArrayIndexOutOfBoundsException' },
              `Index ${i} out of bounds for length ${list.length}`,
              'ArrayIndexOutOfBoundsException'
            );
          }
          return list[i];
        }
        return { type: 'null', value: null };
      }

      case 'newArray': {
        if (expr.initValues) {
          const vals = expr.initValues.map((e) => coerceToType(evalExpr(e, scope, thisObj, currentClass), expr.elemType));
          return { type: 'array', value: vals };
        }
        const len = expr.size ? Math.trunc(Number(evalExpr(expr.size, scope, thisObj, currentClass).value)) : 0;
        const vals = Array.from({ length: len }, () => defaultForType(expr.elemType));
        return { type: 'array', value: vals };
      }

      case 'new': {
        const args = expr.args.map((a) => evalExpr(a, scope, thisObj, currentClass));
        if (expr.className === 'ArrayList' || expr.className === 'LinkedList') {
          return { type: 'list', value: [] as JavaVal[] };
        }
        if (expr.className === 'HashMap' || expr.className === 'TreeMap' || expr.className === 'LinkedHashMap') {
          return { type: 'map', value: new Map<string, { key: JavaVal; val: JavaVal }>() };
        }
        if (expr.className === 'HashSet' || expr.className === 'TreeSet' || expr.className === 'LinkedHashSet') {
          return { type: 'set', value: [] as JavaVal[] };
        }
        if (expr.className === 'StringBuilder') {
          const initStr = args.length > 0 ? formatJavaVal(args[0]) : '';
          return { type: 'stringbuilder', value: { str: initStr } };
        }

        const instance: JavaInstance = {
          className: expr.className,
          fields: new Map(),
        };
        initInstanceFields(instance, expr.className);
        invokeConstructor(instance, expr.className, args);
        return { type: 'object', value: instance, className: expr.className };
      }

      case 'call': {
        const args = expr.args.map((a) => evalExpr(a, scope, thisObj, currentClass));

        if (expr.callee.kind === 'ident') {
          const mName = expr.callee.name;
          return invokeMethod(thisObj, thisObj?.className || currentClass, mName, args);
        }

        if (expr.callee.kind === 'member') {
          const targetObj = evalExpr(expr.callee.object, scope, thisObj, currentClass);
          const mName = expr.callee.property;

          // System.out.println / print / printf
          if (targetObj.type === 'systemOut') {
            if (mName === 'println') {
              stdout += (args.length > 0 ? formatJavaVal(args[0]) : '') + '\n';
              return { type: 'void', value: undefined };
            }
            if (mName === 'print') {
              stdout += args.length > 0 ? formatJavaVal(args[0]) : '';
              return { type: 'void', value: undefined };
            }
            if (mName === 'printf') {
              let fmt = args.length > 0 ? formatJavaVal(args[0]) : '';
              let argIdx = 1;
              fmt = fmt.replace(/%(\.\d+)?[sdfn]/g, (spec) => {
                if (spec === '%n') return '\n';
                const a = args[argIdx++];
                if (!a) return '';
                if (spec.endsWith('f') && spec.startsWith('%.')) {
                  const digits = parseInt(spec.slice(2, -1), 10);
                  return Number(a.value).toFixed(digits);
                }
                return formatJavaVal(a);
              });
              stdout += fmt;
              return { type: 'void', value: undefined };
            }
          }

          // Static class calls: Math.*, Integer.*, Double.*, String.*, Arrays.*
          if (targetObj.type === 'classRef') {
            const cName = targetObj.value as string;
            if (cName === 'Math') {
              if (mName === 'max') return { type: args[0].type, value: Math.max(Number(args[0].value), Number(args[1].value)) };
              if (mName === 'min') return { type: args[0].type, value: Math.min(Number(args[0].value), Number(args[1].value)) };
              if (mName === 'abs') return { type: args[0].type, value: Math.abs(Number(args[0].value)) };
              if (mName === 'pow') return { type: 'double', value: Math.pow(Number(args[0].value), Number(args[1].value)) };
              if (mName === 'sqrt') return { type: 'double', value: Math.sqrt(Number(args[0].value)) };
              if (mName === 'round') return { type: 'int', value: Math.round(Number(args[0].value)) };
            }
            if (cName === 'Integer' && mName === 'parseInt') {
              const v = parseInt(formatJavaVal(args[0]), 10);
              if (Number.isNaN(v)) {
                throw new JavaExceptionSignal({ type: 'object', value: null, className: 'NumberFormatException' }, 'Invalid int', 'NumberFormatException');
              }
              return { type: 'int', value: v };
            }
            if (cName === 'Double' && mName === 'parseDouble') {
              return { type: 'double', value: parseFloat(formatJavaVal(args[0])) };
            }
            if (cName === 'String' && mName === 'valueOf') {
              return { type: 'String', value: formatJavaVal(args[0]) };
            }
            if (cName === 'Arrays' && mName === 'toString') {
              return { type: 'String', value: formatJavaVal(args[0]) };
            }
            return invokeMethod(null, cName, mName, args);
          }

          // super.method(...)
          if (targetObj.type === 'superRef') {
            return invokeMethod(targetObj.value as JavaInstance, targetObj.className!, mName, args);
          }

          // Built-in String methods
          if (targetObj.type === 'String') {
            const s = String(targetObj.value);
            if (mName === 'length') return { type: 'int', value: s.length };
            if (mName === 'toUpperCase') return { type: 'String', value: s.toUpperCase() };
            if (mName === 'toLowerCase') return { type: 'String', value: s.toLowerCase() };
            if (mName === 'trim') return { type: 'String', value: s.trim() };
            if (mName === 'isEmpty') return { type: 'boolean', value: s.length === 0 };
            if (mName === 'equals') return { type: 'boolean', value: args[0]?.type === 'String' && s === args[0].value };
            if (mName === 'equalsIgnoreCase') return { type: 'boolean', value: args[0]?.type === 'String' && s.toLowerCase() === String(args[0].value).toLowerCase() };
            if (mName === 'contains') return { type: 'boolean', value: s.includes(formatJavaVal(args[0])) };
            if (mName === 'startsWith') return { type: 'boolean', value: s.startsWith(formatJavaVal(args[0])) };
            if (mName === 'endsWith') return { type: 'boolean', value: s.endsWith(formatJavaVal(args[0])) };
            if (mName === 'charAt') return { type: 'char', value: s.charAt(Number(args[0].value)) };
            if (mName === 'indexOf') return { type: 'int', value: s.indexOf(formatJavaVal(args[0])) };
            if (mName === 'substring') {
              const start = Number(args[0].value);
              const end = args.length > 1 ? Number(args[1].value) : undefined;
              return { type: 'String', value: s.substring(start, end) };
            }
            if (mName === 'replace') {
              return { type: 'String', value: s.replaceAll(formatJavaVal(args[0]), formatJavaVal(args[1])) };
            }
            if (mName === 'toString') return targetObj;
          }

          // Built-in List / ArrayList methods
          if (targetObj.type === 'list') {
            const list = targetObj.value as JavaVal[];
            if (mName === 'add') {
              if (args.length === 2) {
                list.splice(Number(args[0].value), 0, args[1]);
                return { type: 'void', value: undefined };
              }
              list.push(args[0]);
              return { type: 'boolean', value: true };
            }
            if (mName === 'get') {
              const idx = Number(args[0].value);
              if (idx < 0 || idx >= list.length) {
                throw new JavaExceptionSignal({ type: 'object', value: null, className: 'IndexOutOfBoundsException' }, `Index ${idx} out of bounds`, 'IndexOutOfBoundsException');
              }
              return list[idx];
            }
            if (mName === 'set') {
              const idx = Number(args[0].value);
              const prev = list[idx];
              list[idx] = args[1];
              return prev;
            }
            if (mName === 'remove') {
              if (args[0].type === 'int') {
                const removed = list.splice(Number(args[0].value), 1);
                return removed[0] || { type: 'null', value: null };
              }
              const idx = list.findIndex((item) => item.value === args[0].value);
              if (idx >= 0) {
                list.splice(idx, 1);
                return { type: 'boolean', value: true };
              }
              return { type: 'boolean', value: false };
            }
            if (mName === 'size') return { type: 'int', value: list.length };
            if (mName === 'isEmpty') return { type: 'boolean', value: list.length === 0 };
            if (mName === 'contains') return { type: 'boolean', value: list.some((x) => x.value === args[0].value) };
            if (mName === 'clear') {
              list.length = 0;
              return { type: 'void', value: undefined };
            }
            if (mName === 'toString') return { type: 'String', value: formatJavaVal(targetObj) };
          }

          // Built-in Set / HashSet methods
          if (targetObj.type === 'set') {
            const setList = targetObj.value as JavaVal[];
            if (mName === 'add') {
              const exists = setList.some((x) => x.value === args[0].value);
              if (!exists) setList.push(args[0]);
              return { type: 'boolean', value: !exists };
            }
            if (mName === 'contains') return { type: 'boolean', value: setList.some((x) => x.value === args[0].value) };
            if (mName === 'remove') {
              const idx = setList.findIndex((x) => x.value === args[0].value);
              if (idx >= 0) setList.splice(idx, 1);
              return { type: 'boolean', value: idx >= 0 };
            }
            if (mName === 'size') return { type: 'int', value: setList.length };
            if (mName === 'isEmpty') return { type: 'boolean', value: setList.length === 0 };
            if (mName === 'toString') return { type: 'String', value: formatJavaVal(targetObj) };
          }

          // Built-in Map / HashMap methods
          if (targetObj.type === 'map') {
            const map = targetObj.value as Map<string, { key: JavaVal; val: JavaVal }>;
            if (mName === 'put') {
              const kStr = formatJavaVal(args[0]);
              map.set(kStr, { key: args[0], val: args[1] });
              return args[1];
            }
            if (mName === 'get') {
              const kStr = formatJavaVal(args[0]);
              const entry = map.get(kStr);
              return entry ? entry.val : { type: 'null', value: null };
            }
            if (mName === 'getOrDefault') {
              const kStr = formatJavaVal(args[0]);
              const entry = map.get(kStr);
              return entry ? entry.val : args[1];
            }
            if (mName === 'containsKey') {
              return { type: 'boolean', value: map.has(formatJavaVal(args[0])) };
            }
            if (mName === 'remove') {
              const kStr = formatJavaVal(args[0]);
              const entry = map.get(kStr);
              map.delete(kStr);
              return entry ? entry.val : { type: 'null', value: null };
            }
            if (mName === 'size') return { type: 'int', value: map.size };
            if (mName === 'isEmpty') return { type: 'boolean', value: map.size === 0 };
            if (mName === 'keySet') {
              return { type: 'list', value: Array.from(map.values()).map((e) => e.key) };
            }
            if (mName === 'values') {
              return { type: 'list', value: Array.from(map.values()).map((e) => e.val) };
            }
            if (mName === 'toString') return { type: 'String', value: formatJavaVal(targetObj) };
          }

          // Built-in StringBuilder
          if (targetObj.type === 'stringbuilder') {
            if (mName === 'append') {
              targetObj.value.str += formatJavaVal(args[0]);
              return targetObj;
            }
            if (mName === 'toString') {
              return { type: 'String', value: targetObj.value.str };
            }
            if (mName === 'length') {
              return { type: 'int', value: targetObj.value.str.length };
            }
          }

          if (targetObj.type === 'null' || !targetObj.value) {
            throw new JavaExceptionSignal(
              { type: 'object', value: null, className: 'NullPointerException' },
              `Cannot invoke "${mName}" because target object is null`,
              'NullPointerException'
            );
          }

          if (targetObj.type === 'object') {
            const inst = targetObj.value as JavaInstance;
            return invokeMethod(inst, inst.className, mName, args);
          }
        }

        throw new Error('Main.java: error: unsupported method call');
      }
    }
  }

  try {
    // Initialize static fields for all classes
    for (const c of classes) {
      const sf = staticFields.get(c.name)!;
      const scope = new Scope();
      for (const f of c.fields) {
        if (f.modifiers.includes('static')) {
          const val = f.initExpr ? coerceToType(evalExpr(f.initExpr, scope, null, c.name), f.type) : defaultForType(f.type);
          sf.set(f.name, val);
        }
      }
    }

    const mainClass = classMap.get('Main');
    if (!mainClass) {
      return {
        success: false,
        compilationError: 'Main.java:1: error: class Main is missing',
        runtimeError: null,
        stdout: '',
        stderr: 'Main.java:1: error: class Main is missing',
        executionTimeMs: Date.now() - startTime,
      };
    }

    const mainMethod = mainClass.methods.find((m) => m.name === 'main');
    if (!mainMethod || !mainMethod.body) {
      return {
        success: false,
        compilationError: 'Error: Main method not found in class Main, please define the main method as:\n   public static void main(String[] args)',
        runtimeError: null,
        stdout: '',
        stderr: 'Error: Main method not found in class Main',
        executionTimeMs: Date.now() - startTime,
      };
    }

    const mainScope = new Scope();
    if (mainMethod.params.length > 0) {
      mainScope.declare(mainMethod.params[0].name, { type: 'array', value: [] });
    }

    try {
      execBlock(mainMethod.body, mainScope, null, 'Main');
    } catch (sig) {
      if (!(sig instanceof ReturnSignal)) throw sig;
    }

    return {
      success: true,
      compilationError: null,
      runtimeError: null,
      stdout,
      stderr: '',
      executionTimeMs: Date.now() - startTime,
    };
  } catch (err: unknown) {
    if (err instanceof JavaExceptionSignal) {
      const errMsg = `Exception in thread "main" java.lang.${err.exceptionType}: ${err.message}`;
      return {
        success: false,
        compilationError: null,
        runtimeError: errMsg,
        stdout,
        stderr: errMsg,
        executionTimeMs: Date.now() - startTime,
      };
    }
    const msg = err instanceof Error ? err.message : 'Compilation error';
    return {
      success: false,
      compilationError: msg,
      runtimeError: null,
      stdout,
      stderr: msg,
      executionTimeMs: Date.now() - startTime,
    };
  }
}

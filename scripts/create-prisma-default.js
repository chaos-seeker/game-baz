const fs = require('fs');
const path = require('path');

const defaultPath = path.join(
  __dirname,
  '../node_modules/.prisma/client/default.ts',
);
const content = "export * from './client';\n";

try {
  fs.writeFileSync(defaultPath, content, 'utf8');
  console.log('✓ Created default.ts for Prisma Client');
} catch (error) {
  console.error('Error creating default.ts:', error);
  process.exit(1);
}

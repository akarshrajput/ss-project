const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const filesToUpdate = execSync('grep -rl "createSupabaseServerClient\\|createOptionalSupabaseServerClient" src', { encoding: 'utf-8' }).split('\n').filter(Boolean);

filesToUpdate.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Replace imports
  content = content.replace(/import\s+\{\s*(createSupabaseServerClient|createOptionalSupabaseServerClient)\s*\}\s+from\s+["']@\/lib\/supabase\/server["'];?/g, 'import { getUser } from "@/lib/auth";');
  
  // Common replacements for user fetch
  content = content.replace(/const\s+supabase\s*=\s*await\s+create(?:Optional)?SupabaseServerClient\(\);\s*const\s+\{\s*data:\s*\{\s*user\s*\}\s*\}\s*=\s*await\s+supabase\.auth\.getUser\(\);/g, 'const user = await getUser();');
  
  content = content.replace(/const\s+supabase\s*=\s*await\s+create(?:Optional)?SupabaseServerClient\(\);\s*const\s+user\s*=\s*supabase\s*\?\s*\(await\s+supabase\.auth\.getUser\(\)\)\.data\.user\s*:\s*null;/g, 'const user = await getUser();');

  fs.writeFileSync(file, content, 'utf-8');
});
console.log('Bulk replace completed');

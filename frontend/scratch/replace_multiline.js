const fs = require('fs');
const files = [
  'src/app/dashboard/page.tsx',
  'src/app/api/song-queue/cron/status/route.ts',
  'src/app/api/song-queue/route.ts',
  'src/app/api/song-queue/generate/route.ts',
  'src/app/api/song-queue/cron/trigger/route.ts',
  'src/app/api/song-queue/reject/route.ts',
  'src/app/library/page.tsx',
  'src/app/admin/actions.ts'
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let text = fs.readFileSync(f, 'utf8');
    text = text.replace(/const\s+supabase\s*=\s*await\s+create(?:Optional)?SupabaseServerClient\(\);\s*const\s*\{\s*data:\s*\{\s*user\s*\}\s*,?\s*\}\s*=\s*await\s+supabase\.auth\.getUser\(\);/g, 'const user = await getUser();');
    fs.writeFileSync(f, text);
  }
});
console.log('Multiline replace completed');

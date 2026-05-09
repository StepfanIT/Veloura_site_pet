import { defineConfig } from 'vite';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserPagesRepo = repository.endsWith('.github.io');

export default defineConfig({
  base: repository && !isUserPagesRepo ? `/${repository}/` : '/'
});

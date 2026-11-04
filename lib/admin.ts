import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../app/chatgpt-auth';
export async function isAdmin(){const user=await getChatGPTUser();if(!user)return null;const settings=env as unknown as Record<string,string>;const ids=(settings.ADMIN_USER_IDS||'').split(',').map(s=>s.trim()).filter(Boolean);const emails=(settings.ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);return ids.includes(user.userId)||emails.includes(user.email.toLowerCase())?user:null}

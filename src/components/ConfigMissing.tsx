export default function ConfigMissing() {
  return (
    <div className="m-6 rounded-2xl bg-white p-5 text-sm text-ink shadow-soft">
      <div className="mb-2 text-lg font-bold text-terracotta">⚠️ 尚未配置 Supabase</div>
      <p className="text-muted">
        请把项目根目录的 <code>.env.example</code> 复制为 <code>.env.local</code>，填入你的 Supabase
        项目 URL 与 anon key，然后重启开发服务器（<code>npm run dev</code>）即可。
      </p>
    </div>
  )
}

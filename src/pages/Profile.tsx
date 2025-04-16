{/* ⚙️ Google Fit статус */}
<div className="mt-6 max-w-sm w-full text-center">
  {user.google_connected ? (
    <>
      <div className="text-sm text-green-400 mb-2">
        ✅ Google Fit подключён
      </div>
      {/* 🚀 Кнопка запуска синхронизации */}
      <button
        onClick={() => {
          fetch('https://api.fitmine.vip/api/sync/google', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
            .then(res => res.json())
            .then(data => {
              if (data.ok) {
                alert('📊 Активность синхронизирована!');
              } else {
                alert(`❌ Ошибка: ${data.error}`);
              }
            })
            .catch(() => alert('❌ Ошибка соединения'));
        }}
        className="px-4 py-2 mt-2 text-sm bg-green-500 text-white rounded-full shadow hover:scale-105 transition-transform"
      >
        🔄 Синхронизировать активность
      </button>
    </>
  ) : (
    <>
      <div className="text-sm text-yellow-300 mb-2">
        🔓 Google Fit не подключён
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-xs">
          <ConnectGoogleFit />
        </div>
      </div>
    </>
  )}
</div>

export default Profile;

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Teste - Servidor Funcionando! ✅
        </h1>
        <p className="text-xl text-white/70">
          Se você está vendo esta página, o Next.js está rodando corretamente.
        </p>
        <div className="mt-8 space-y-4">
          <a 
            href="/auth/signin" 
            className="block text-blue-400 hover:text-blue-300 underline"
          >
            Ir para Login
          </a>
          <a 
            href="/dashboard" 
            className="block text-green-400 hover:text-green-300 underline"
          >
            Ir para Dashboard (requer login)
          </a>
        </div>
      </div>
    </div>
  );
}
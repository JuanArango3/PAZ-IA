import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Chat from "@/app/Chat";


export default function Home() {
  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    PAZ.IA
                </CardTitle>
                <p className="text-xs text-gray-500 mt-1">
                    Nota: Este asistente se ejecuta en un servidor modesto. Las respuestas pueden tardar entre 1 y 5 minutos. ¡Gracias por tu paciencia!
                </p>

            </CardHeader>
            <CardContent>
                <Chat />
            </CardContent>
        </Card>
      </div>
  );
}

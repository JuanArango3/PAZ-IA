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

            </CardHeader>
            <CardContent>
                <Chat />
            </CardContent>
        </Card>
      </div>
  );
}

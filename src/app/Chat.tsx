"use client";

import {useEffect, useRef, useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {generateResponse} from "@/app/actions/ollama";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Converter} from "showdown";
import DOMPurify from 'dompurify';


interface Message {
    role: "user" | "assistant";
    content: string;
}

const FormSchema = z.object({
    message: z.string().nonempty().max(500)
})

const converter = new Converter({
    simplifiedAutoLink: true,
    strikethrough: true,
    tables: true,
    tasklists: true
});

export default function Chat() {

    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {message: ""}
    });

    const sanitizeHtml = (dirtyHtml: string) => {
        if (typeof window !== 'undefined') {
            return DOMPurify.sanitize(dirtyHtml);
        }
        return dirtyHtml;
    };

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true);

        const userMessage:Message = {role: "user", content: data.message};

        setMessages(prev => [...prev, userMessage]);
        form.reset();

        try {
            const history = messages.map(m => `${m.role}: ${m.content}`);
            const response = await generateResponse({
                messages: history,
                userInput: userMessage.content
            });
            const cleanHtml = sanitizeHtml(converter.makeHtml(response));
            setMessages(prev => {
                return [...prev, {role: "assistant", content: cleanHtml}];
            });
        } catch (e) {
            console.error(e);
            setMessages(prev => {
                return [...prev, {role: "assistant", content: "⚠️ Error al procesar la solicitud"}];
            })
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return <div className="space-y-6">
        <ScrollArea className="h-[500px] rounded-md border p-4">
            {messages.map((msg, index) => (
                <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-3 rounded-lg ${
                        msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                        {msg.role === 'user' ? (
                            <p className="text-sm">{msg.content}</p>
                        ) : (
                            <div
                                className="text-sm prose max-w-none"
                                dangerouslySetInnerHTML={{__html: msg.content}}
                            />
                        )}
                    </div>
                </div>
            ))}
            <div ref={scrollRef} />
        </ScrollArea>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <Input {...form.register("message")} placeholder="Ingresa tu pregunta" disabled={loading} />
            <Button type="submit" disabled={loading}>{loading ? "Procesando" : "Enviar"}</Button>
        </form>
    </div>;
}
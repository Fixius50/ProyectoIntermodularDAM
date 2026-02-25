import {
    RSocketClient,
    JsonSerializer,
    IdentitySerializer
} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { ReactiveSocket, Payload } from 'rsocket-types';
import { Subject, Observable } from 'rxjs';

export interface BattleAction {
    sessionId: string;
    playerId: string;
    seedsSpent: number;
}

export interface BattleSession {
    sessionId: string;
    playerOneId: string;
    playerTwoId: string;
    playerOneHealth: number;
    playerTwoHealth: number;
    currentRound: number;
    playerOnePendingAction: number | null;
    playerTwoPendingAction: number | null;
    status: 'WAITING' | 'IN_PROGRESS' | 'FINISHED';
    winnerId: string | null;
}

class BattleSocketService {
    private rsocket: ReactiveSocket<any, any> | null = null;
    private stateSubject = new Subject<BattleSession>();

    private client = new RSocketClient({
        serializers: {
            data: JsonSerializer,
            metadata: IdentitySerializer
        },
        setup: {
            keepAlive: 60000,
            lifetime: 180000,
            metadataMimeType: 'message/x.rsocket.routing.v0',
            dataMimeType: 'application/json',
        },
        transport: new RSocketWebSocketClient({
            url: 'ws://localhost:7000', // Update for Tailscale
        }),
    });

    public async connect(): Promise<void> {
        if (this.rsocket) return;
        try {
            this.rsocket = await new Promise((resolve, reject) => {
                this.client.connect().subscribe({
                    onComplete: (socket) => resolve(socket),
                    onError: (error) => reject(error),
                    onSubscribe: () => { } // cancel not strictly needed for basic promise
                });
            });
            console.log('RSocket connected to Battle Server');
        } catch (error) {
            console.error('RSocket connection failed', error);
            throw error;
        }
    }

    private encodeRoute(route: string): string {
        return String.fromCharCode(route.length) + route;
    }

    public createMatch(playerId: string, birdCardId: string): Observable<BattleSession> {
        if (!this.rsocket) throw new Error('Not connected');

        const subject = new Subject<BattleSession>();
        this.rsocket.requestResponse({
            data: { playerId, sessionId: birdCardId }, // Overloaded sessionId for birdId for now
            metadata: this.encodeRoute('battle.room.create'),
        }).subscribe({
            onComplete: (payload: Payload<any, any>) => {
                const session = payload.data || {};
                subject.next(session);
                subject.complete();
            },
            onError: (err: any) => subject.error(err),
            onSubscribe: () => { },
        });
        return subject.asObservable();
    }

    public joinMatch(sessionId: string, playerId: string): Observable<BattleSession> {
        if (!this.rsocket) throw new Error('Not connected');

        const subject = new Subject<BattleSession>();
        this.rsocket.requestResponse({
            data: { sessionId, playerId },
            metadata: this.encodeRoute('battle.room.join'),
        }).subscribe({
            onComplete: (payload: Payload<any, any>) => {
                const session = payload.data || {};
                subject.next(session);
                subject.complete();
            },
            onError: (err: any) => subject.error(err),
            onSubscribe: () => { },
        });
        return subject.asObservable();
    }

    public streamBattle(sessionId: string): Observable<BattleSession> {
        if (!this.rsocket) throw new Error('Not connected');

        // Note: The backend uses @MessageMapping("battle.action.stream") which is Flux<BattleAction> -> Flux<BattleSession>
        // Here we simulate a stream listener. If the backend is Request-Stream:
        this.rsocket.requestStream({
            data: { sessionId }, // Initial request to start stream
            metadata: this.encodeRoute('battle.action.stream'),
        }).subscribe({
            onNext: (payload: Payload<any, any>) => {
                const session = payload.data || {};
                this.stateSubject.next(session);
            },
            onComplete: () => console.log('Battle stream completed'),
            onError: (err: any) => console.error('Battle stream error', err),
            onSubscribe: (subscription) => {
                subscription.request(2147483647); // request max
            },
        });

        return this.stateSubject.asObservable();
    }

    public sendAction(action: BattleAction): void {
        if (!this.rsocket) throw new Error('Not connected');

        // We use Fire-and-forget or Request-Response depending on backend.
        // Assuming the stream listener above handles the state update response.
        this.rsocket.fireAndForget({
            data: action,
            metadata: this.encodeRoute('battle.action.stream'),
        });
    }
}

export const battleSocket = new BattleSocketService();

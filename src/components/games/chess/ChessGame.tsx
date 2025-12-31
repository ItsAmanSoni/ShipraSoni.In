"use client";

import { useState } from 'react';
import { Column, Row, ToggleButton, Line } from '@once-ui-system/core';
import { useChessGame } from '@/hooks/useChessGame';
import { useOnlineChess } from '@/hooks/useOnlineChess';
import { ChessBoard } from './ChessBoard';
import { MoveHistory } from './MoveHistory';
import { GameControls } from './GameControls';
import { OnlineControls } from './OnlineControls';
import { PromotionDialog } from './PromotionDialog';

type ActiveTab = 'play' | 'history' | 'settings';

export function ChessGame() {
  const [selectedMode, setSelectedMode] = useState<'local-ai' | 'online'>('local-ai');
  const [activeTab, setActiveTab] = useState<ActiveTab>('play');

  // Local/AI game hook
  const localGame = useChessGame('local');

  // Online game hook
  const onlineGame = useOnlineChess();

  // Determine which game data to use
  const isOnlineMode = selectedMode === 'online';
  const {
    position,
    selectedSquare,
    legalMoves,
    gameStatus,
    moveHistory,
    lastMove,
    turn,
    handleSquareClick,
    handlePromotion,
  } = isOnlineMode ? onlineGame : localGame;

  const pendingPromotion = isOnlineMode ? null : localGame.pendingPromotion;

  return (
    <Column fillWidth gap="l">
      <Row
        fillWidth
        gap="l"
        s={{ direction: 'column' }}
      >
        {/* Chess Board - Left Side */}
        <Column
          flex={3}
          gap="m"
          s={{ flex: '1' }}
        >
          <ChessBoard
            position={position}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            lastMove={lastMove}
            onSquareClick={handleSquareClick}
            flipped={isOnlineMode && onlineGame.playerColor === 'b'}
          />
        </Column>

        {/* Right Panel */}
        <Column
          flex={2}
          gap="m"
          s={{ flex: '1' }}
        >
          {/* Tab Navigation */}
          <Row
            background="page"
            border="neutral-alpha-weak"
            shadow="s"
            padding="4"
            fillWidth
            style={{ borderRadius: '9999px' }}
          >
            <Row gap="4" fillWidth>
              <ToggleButton
                prefixIcon="gamepad"
                label="Play"
                selected={activeTab === 'play'}
                onClick={() => setActiveTab('play')}
                style={{ flex: 1, borderRadius: '9999px', padding: '12px 16px' }}
              />
              <ToggleButton
                prefixIcon="refresh"
                label="History"
                selected={activeTab === 'history'}
                onClick={() => setActiveTab('history')}
                style={{ flex: 1, borderRadius: '9999px', padding: '12px 16px' }}
              />
              <ToggleButton
                prefixIcon="grid"
                label="Settings"
                selected={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
                style={{ flex: 1, borderRadius: '9999px', padding: '12px 16px' }}
              />
            </Row>
          </Row>

          {/* Tab Content */}
          {activeTab === 'play' && (
            <>
              {isOnlineMode ? (
                <OnlineControls
                  roomCode={onlineGame.roomCode}
                  roomStatus={onlineGame.roomStatus}
                  playerColor={onlineGame.playerColor}
                  opponentName={onlineGame.opponentName}
                  opponentConnected={onlineGame.opponentConnected}
                  isMyTurn={onlineGame.isMyTurn}
                  error={onlineGame.error}
                  whiteTime={onlineGame.whiteTime}
                  blackTime={onlineGame.blackTime}
                  timerActive={onlineGame.timerActive}
                  onCreateRoom={onlineGame.createRoom}
                  onJoinRoom={onlineGame.joinRoom}
                  onLeaveRoom={onlineGame.leaveRoom}
                  onCopyRoomCode={onlineGame.copyRoomCode}
                />
              ) : (
                <GameControls
                  onNewGame={localGame.newGame}
                  onUndo={localGame.undo}
                  canUndo={localGame.canUndo}
                  gameStatus={gameStatus}
                  turn={turn}
                  aiThinking={localGame.aiThinking}
                />
              )}
            </>
          )}

          {activeTab === 'history' && (
            <MoveHistory moves={moveHistory} />
          )}

          {activeTab === 'settings' && (
            <GameControls
              onNewGame={localGame.newGame}
              onUndo={localGame.undo}
              canUndo={localGame.canUndo}
              gameStatus={gameStatus}
              turn={turn}
              gameMode={localGame.gameMode}
              onGameModeChange={localGame.setGameMode}
              difficulty={localGame.difficulty}
              onDifficultyChange={localGame.setDifficulty}
              playerColor={localGame.playerColor}
              onPlayerColorChange={localGame.setPlayerColor}
              aiThinking={localGame.aiThinking}
              selectedMode={selectedMode}
              onModeChange={setSelectedMode}
              settingsView
            />
          )}
        </Column>
      </Row>

      {/* Promotion Dialog */}
      {pendingPromotion && (
        <PromotionDialog
          color={turn}
          onSelect={handlePromotion}
        />
      )}
    </Column>
  );
}

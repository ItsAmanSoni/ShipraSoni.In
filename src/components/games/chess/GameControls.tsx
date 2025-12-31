import React from 'react';
import { Row, Column, Text, Badge, ToggleButton, Icon } from '@once-ui-system/core';
import { GameStatus, GameMode } from '@/types/chess.types';
import { AIDifficulty } from '@/hooks/useChessAI';

interface GameControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  gameStatus: GameStatus;
  turn: 'w' | 'b';
  gameMode?: GameMode;
  onGameModeChange?: (mode: GameMode) => void;
  difficulty?: AIDifficulty;
  onDifficultyChange?: (difficulty: AIDifficulty) => void;
  playerColor?: 'w' | 'b';
  onPlayerColorChange?: (color: 'w' | 'b') => void;
  aiThinking?: boolean;
  selectedMode?: 'local-ai' | 'online';
  onModeChange?: (mode: 'local-ai' | 'online') => void;
  settingsView?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onUndo,
  canUndo,
  gameStatus,
  turn,
  gameMode = 'local',
  onGameModeChange,
  difficulty = 'medium',
  onDifficultyChange,
  playerColor = 'w',
  onPlayerColorChange,
  aiThinking = false,
  selectedMode = 'local-ai',
  onModeChange,
  settingsView = false,
}) => {
  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'check':
        return 'Check!';
      case 'checkmate':
        return `Checkmate! ${turn === 'w' ? 'Black' : 'White'} wins!`;
      case 'stalemate':
        return 'Stalemate - Draw!';
      case 'draw':
        return 'Draw!';
      default:
        return `${turn === 'w' ? 'White' : 'Black'} to move`;
    }
  };

  const getStatusColor = () => {
    if (gameStatus === 'check' || gameStatus === 'checkmate') {
      return { background: 'accent-alpha-weak' as const, onBackground: 'accent-strong' as const };
    }
    if (gameStatus === 'stalemate' || gameStatus === 'draw') {
      return { background: 'neutral-alpha-weak' as const, onBackground: 'neutral-strong' as const };
    }
    return { background: 'brand-alpha-weak' as const, onBackground: 'brand-strong' as const };
  };

  const statusColor = getStatusColor();

  // Settings View - Full configuration
  if (settingsView && onModeChange) {
    return (
      <Column fillWidth gap="m">
        {/* Mode Selection */}
        <Column fillWidth gap="xs">
          <Text variant="label-default-s" onBackground="neutral-weak">
            Mode
          </Text>
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
                label="Local / AI"
                selected={selectedMode === 'local-ai'}
                onClick={() => onModeChange('local-ai')}
                style={{ flex: 1, borderRadius: '9999px', padding: '12px 16px' }}
              />
              <ToggleButton
                label="Online"
                selected={selectedMode === 'online'}
                onClick={() => onModeChange('online')}
                style={{ flex: 1, borderRadius: '9999px', padding: '12px 16px' }}
              />
            </Row>
          </Row>
        </Column>

        {/* Game Type - Only for local-ai mode */}
        {selectedMode === 'local-ai' && onGameModeChange && (
          <Column fillWidth gap="xs">
            <Text variant="label-default-s" onBackground="neutral-weak">
              Game Type
            </Text>
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
                  label="Local"
                  selected={gameMode === 'local'}
                  onClick={() => onGameModeChange('local')}
                  style={{ flex: 1, borderRadius: '9999px', padding: '12px 16px' }}
                />
                <ToggleButton
                  label="vs AI"
                  selected={gameMode === 'ai'}
                  onClick={() => onGameModeChange('ai')}
                  style={{ flex: 1, borderRadius: '9999px', padding: '12px 16px' }}
                />
              </Row>
            </Row>
          </Column>
        )}

        {/* AI Settings - Only show when in AI mode */}
        {gameMode === 'ai' && selectedMode === 'local-ai' && (
          <>
            {/* Difficulty Selector */}
            {onDifficultyChange && (
              <Column fillWidth gap="xs">
                <Text variant="label-default-s" onBackground="neutral-weak">
                  AI Difficulty
                </Text>
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
                      label="Easy"
                      selected={difficulty === 'easy'}
                      onClick={() => onDifficultyChange('easy')}
                      style={{ flex: 1, borderRadius: '9999px', padding: '12px 16px' }}
                    />
                    <ToggleButton
                      label="Medium"
                      selected={difficulty === 'medium'}
                      onClick={() => onDifficultyChange('medium')}
                      style={{ flex: 1, borderRadius: '9999px', padding: '12px 16px' }}
                    />
                    <ToggleButton
                      label="Hard"
                      selected={difficulty === 'hard'}
                      onClick={() => onDifficultyChange('hard')}
                      style={{ flex: 1, borderRadius: '9999px', padding: '12px 16px' }}
                    />
                  </Row>
                </Row>
              </Column>
            )}

            {/* Player Color Selector */}
            {onPlayerColorChange && (
              <Column fillWidth gap="xs">
                <Text variant="label-default-s" onBackground="neutral-weak">
                  Play as
                </Text>
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
                      label="White"
                      selected={playerColor === 'w'}
                      onClick={() => onPlayerColorChange('w')}
                      style={{ flex: 1, borderRadius: '9999px', padding: '12px 16px' }}
                    />
                    <ToggleButton
                      label="Black"
                      selected={playerColor === 'b'}
                      onClick={() => onPlayerColorChange('b')}
                      style={{ flex: 1, borderRadius: '9999px', padding: '12px 16px' }}
                    />
                  </Row>
                </Row>
              </Column>
            )}
          </>
        )}
      </Column>
    );
  }

  // Play View - Minimal controls
  return (
    <Column fillWidth gap="m">
      {/* Game Status Badge */}
      <Row fillWidth horizontal="center">
        {aiThinking ? (
          <Badge
            background="accent-alpha-weak"
            onBackground="accent-strong"
            arrow={false}
          >
            AI is thinking...
          </Badge>
        ) : (
          <Badge
            background={statusColor.background}
            onBackground={statusColor.onBackground}
            arrow={false}
          >
            {getStatusMessage()}
          </Badge>
        )}
      </Row>

      {/* Quick Actions - Single Row */}
      <Row fillWidth gap="s">
        <Row
          flex={1}
          gap="xs"
          background="surface"
          border="neutral-medium"
          vertical="center"
          horizontal="center"
          onClick={onNewGame}
          style={{ cursor: 'pointer', transition: 'all 0.2s ease', borderRadius: '9999px', padding: '12px 16px' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--neutral-alpha-weak)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
          }}
        >
          <Icon name="refresh" onBackground="neutral-medium" />
          <Text variant="label-default-s">New Game</Text>
        </Row>

        <Row
          flex={1}
          gap="xs"
          background="surface"
          border="neutral-medium"
          vertical="center"
          horizontal="center"
          onClick={onUndo}
          style={{
            cursor: canUndo && !aiThinking ? 'pointer' : 'not-allowed',
            opacity: canUndo && !aiThinking ? 1 : 0.5,
            transition: 'all 0.2s ease',
            borderRadius: '9999px',
            padding: '12px 16px'
          }}
          onMouseEnter={(e) => {
            if (canUndo && !aiThinking) {
              e.currentTarget.style.backgroundColor = 'var(--neutral-alpha-weak)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
          }}
        >
          <Icon name="arrowLeft" onBackground="neutral-medium" />
          <Text variant="label-default-s">Undo</Text>
        </Row>
      </Row>
    </Column>
  );
};

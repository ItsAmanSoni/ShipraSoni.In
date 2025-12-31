import React, { useState } from 'react';
import { Row, Column, Text, Input, Badge, ToggleButton, Icon } from '@once-ui-system/core';
import type { PieceColor, TimeControl } from '@/types/chess.types';
import { ChessTimer } from './ChessTimer';

interface OnlineControlsProps {
  roomCode: string | null;
  roomStatus: 'idle' | 'creating' | 'joining' | 'waiting' | 'active' | 'finished';
  playerColor: PieceColor | null;
  opponentName: string | null;
  opponentConnected: boolean;
  isMyTurn: boolean;
  error: string | null;
  whiteTime?: string;
  blackTime?: string;
  timerActive?: PieceColor | null;
  onCreateRoom: (playerName: string, color: PieceColor, timeControl?: TimeControl) => void;
  onJoinRoom: (roomCode: string, playerName: string) => void;
  onLeaveRoom: () => void;
  onCopyRoomCode: () => void;
}

const TIME_CONTROL_OPTIONS = [
  { label: 'None', value: null },
  { label: '1 min', value: { type: 'blitz' as const, initialTime: 60000, increment: 0 } },
  { label: '3 min', value: { type: 'blitz' as const, initialTime: 180000, increment: 0 } },
  { label: '5 min', value: { type: 'blitz' as const, initialTime: 300000, increment: 0 } },
  { label: '10 min', value: { type: 'rapid' as const, initialTime: 600000, increment: 0 } },
];

export const OnlineControls: React.FC<OnlineControlsProps> = ({
  roomCode,
  roomStatus,
  playerColor,
  opponentName,
  opponentConnected,
  isMyTurn,
  error,
  whiteTime,
  blackTime,
  timerActive,
  onCreateRoom,
  onJoinRoom,
  onLeaveRoom,
  onCopyRoomCode,
}) => {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [playerName, setPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState<PieceColor>('w');
  const [joinCode, setJoinCode] = useState('');
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControl | null>(null);

  const handleCreateRoom = () => {
    if (playerName.trim()) {
      onCreateRoom(playerName.trim(), selectedColor, selectedTimeControl || undefined);
    }
  };

  const handleJoinRoom = () => {
    if (playerName.trim() && joinCode.trim()) {
      onJoinRoom(joinCode.trim().toUpperCase(), playerName.trim());
    }
  };

  const resetToMenu = () => {
    setMode('menu');
    setPlayerName('');
    setJoinCode('');
  };

  // Idle state - show create/join options
  if (roomStatus === 'idle') {
    if (mode === 'menu') {
      return (
        <Column fillWidth gap="m">
          <Text variant="label-default-m" onBackground="neutral-strong">
            Online Multiplayer
          </Text>

          <Row fillWidth gap="s">
            <Row
              flex={1}
              gap="xs"
              background="surface"
              border="neutral-medium"
              vertical="center"
              horizontal="center"
              onClick={() => setMode('create')}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease', borderRadius: '9999px', padding: '12px 16px' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--neutral-alpha-weak)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
              }}
            >
              <Icon name="plus" onBackground="neutral-medium" />
              <Text variant="label-default-s">Create Room</Text>
            </Row>

            <Row
              flex={1}
              gap="xs"
              background="surface"
              border="neutral-medium"
              vertical="center"
              horizontal="center"
              onClick={() => setMode('join')}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease', borderRadius: '9999px', padding: '12px 16px' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--neutral-alpha-weak)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
              }}
            >
              <Icon name="arrowUpRight" onBackground="neutral-medium" />
              <Text variant="label-default-s">Join Room</Text>
            </Row>
          </Row>

          {error && (
            <Badge background="accent-alpha-weak" onBackground="accent-strong" arrow={false}>
              {error}
            </Badge>
          )}
        </Column>
      );
    }

    if (mode === 'create') {
      return (
        <Column fillWidth gap="m">
          <Text variant="label-default-m" onBackground="neutral-strong">
            Create Room
          </Text>

          <Column fillWidth gap="xs">
            <Text variant="label-default-s" onBackground="neutral-weak">
              Your Name
            </Text>
            <div style={{ width: '100%' }}>
              <style>{`
                #player-name {
                  border-radius: 9999px !important;
                }
                #player-name input {
                  border-radius: 9999px !important;
                }
              `}</style>
              <Input
                id="player-name"
                label=""
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </Column>

          <Column fillWidth gap="xs">
            <Text variant="label-default-s" onBackground="neutral-weak">
              Time Control
            </Text>
            <Row
              background="page"
              border="neutral-alpha-weak"
              shadow="s"
              padding="4"
              fillWidth
              style={{ borderRadius: '9999px' }}
            >
              <Row gap="4" fillWidth wrap>
                {TIME_CONTROL_OPTIONS.map((option, index) => (
                  <ToggleButton
                    key={index}
                    label={option.label}
                    selected={selectedTimeControl === option.value}
                    onClick={() => setSelectedTimeControl(option.value)}
                    style={{ flex: 1, borderRadius: '9999px', padding: '12px 16px' }}
                  />
                ))}
              </Row>
            </Row>
          </Column>

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
                  selected={selectedColor === 'w'}
                  onClick={() => setSelectedColor('w')}
                  style={{ flex: 1, borderRadius: '9999px', padding: '12px 16px' }}
                />
                <ToggleButton
                  label="Black"
                  selected={selectedColor === 'b'}
                  onClick={() => setSelectedColor('b')}
                  style={{ flex: 1, borderRadius: '9999px', padding: '12px 16px' }}
                />
              </Row>
            </Row>
          </Column>

          <Row fillWidth gap="s">
            <Row
              flex={1}
              gap="xs"
              paddingX="m"
              paddingY="s"
              background="surface"
              border="neutral-medium"
              vertical="center"
              horizontal="center"
              onClick={resetToMenu}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease', borderRadius: '9999px' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--neutral-alpha-weak)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
              }}
            >
              <Icon name="arrowLeft" onBackground="neutral-medium" />
              <Text variant="label-default-s">Back</Text>
            </Row>

            <Row
              flex={1}
              gap="xs"
              paddingX="m"
              paddingY="s"
              background="surface"
              border="neutral-medium"
              vertical="center"
              horizontal="center"
              onClick={handleCreateRoom}
              style={{
                cursor: playerName.trim() ? 'pointer' : 'not-allowed',
                opacity: playerName.trim() ? 1 : 0.5,
                transition: 'all 0.2s ease',
                borderRadius: '9999px'
              }}
              onMouseEnter={(e) => {
                if (playerName.trim()) {
                  e.currentTarget.style.backgroundColor = 'var(--neutral-alpha-weak)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
              }}
            >
              <Icon name="plus" onBackground="neutral-medium" />
              <Text variant="label-default-s">Create</Text>
            </Row>
          </Row>

          {error && (
            <Badge background="accent-alpha-weak" onBackground="accent-strong" arrow={false}>
              {error}
            </Badge>
          )}
        </Column>
      );
    }

    if (mode === 'join') {
      return (
        <Column fillWidth gap="m">
          <Text variant="label-default-m" onBackground="neutral-strong">
            Join Room
          </Text>

          <Column fillWidth gap="xs">
            <Text variant="label-default-s" onBackground="neutral-weak">
              Your Name
            </Text>
            <div style={{ width: '100%' }}>
              <style>{`
                #player-name {
                  border-radius: 9999px !important;
                }
                #player-name input {
                  border-radius: 9999px !important;
                }
              `}</style>
              <Input
                id="player-name"
                label=""
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </Column>

          <Column fillWidth gap="xs">
            <Text variant="label-default-s" onBackground="neutral-weak">
              Room Code
            </Text>
            <div style={{ width: '100%' }}>
              <style>{`
                #room-code {
                  border-radius: 9999px !important;
                }
                #room-code input {
                  border-radius: 9999px !important;
                }
              `}</style>
              <Input
                id="room-code"
                label=""
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ABCD12"
                maxLength={6}
              />
            </div>
          </Column>

          <Row fillWidth gap="s">
            <Row
              flex={1}
              gap="xs"
              paddingX="m"
              paddingY="s"
              background="surface"
              border="neutral-medium"
              vertical="center"
              horizontal="center"
              onClick={resetToMenu}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease', borderRadius: '9999px' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--neutral-alpha-weak)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
              }}
            >
              <Icon name="arrowLeft" onBackground="neutral-medium" />
              <Text variant="label-default-s">Back</Text>
            </Row>

            <Row
              flex={1}
              gap="xs"
              padding="4"
              background="surface"
              border="neutral-medium"
              vertical="center"
              horizontal="center"
              onClick={handleJoinRoom}
              style={{
                cursor: (playerName.trim() && joinCode.trim()) ? 'pointer' : 'not-allowed',
                opacity: (playerName.trim() && joinCode.trim()) ? 1 : 0.5,
                transition: 'all 0.2s ease',
                borderRadius: '9999px'
              }}
              onMouseEnter={(e) => {
                if (playerName.trim() && joinCode.trim()) {
                  e.currentTarget.style.backgroundColor = 'var(--neutral-alpha-weak)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
              }}
            >
              <Icon name="arrowUpRight" onBackground="neutral-medium" />
              <Text variant="label-default-s">Join</Text>
            </Row>
          </Row>

          {error && (
            <Badge background="accent-alpha-weak" onBackground="accent-strong" arrow={false}>
              {error}
            </Badge>
          )}
        </Column>
      );
    }
  }

  // Waiting for opponent
  if (roomStatus === 'waiting') {
    return (
      <Column fillWidth gap="m">
        <Column fillWidth gap="s" padding="m" background="surface" border="neutral-medium" style={{ borderRadius: '16px' }}>
          <Text variant="label-default-s" onBackground="neutral-weak">
            Room Code
          </Text>
          <Row fillWidth gap="s" horizontal="between" vertical="center">
            <Text variant="heading-strong-l">{roomCode}</Text>
            <Row
              gap="xs"
              paddingX="m"
              paddingY="xs"
              background="page"
              border="neutral-alpha-weak"
              vertical="center"
              horizontal="center"
              onClick={onCopyRoomCode}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease', borderRadius: '9999px' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--neutral-alpha-weak)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
              }}
            >
              <Icon name="copy" onBackground="neutral-medium" />
              <Text variant="label-default-xs">Copy</Text>
            </Row>
          </Row>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Share this code with your opponent
          </Text>
        </Column>

        <Row fillWidth horizontal="center">
          <Badge background="brand-alpha-weak" onBackground="brand-strong" arrow={false}>
            Waiting for opponent...
          </Badge>
        </Row>

        <Row
          fillWidth
          gap="xs"
          paddingX="m"
          paddingY="s"
          background="surface"
          border="neutral-medium"
          vertical="center"
          horizontal="center"
          onClick={onLeaveRoom}
          style={{ cursor: 'pointer', transition: 'all 0.2s ease', borderRadius: '9999px' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--neutral-alpha-weak)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
          }}
        >
          <Icon name="close" onBackground="neutral-medium" />
          <Text variant="label-default-s">Cancel</Text>
        </Row>
      </Column>
    );
  }

  // Game active or finished
  if (roomStatus === 'active' || roomStatus === 'finished') {
    return (
      <Column fillWidth gap="m">
        <Column fillWidth gap="xs" padding="m" background="surface" border="neutral-medium" style={{ borderRadius: '16px' }}>
          <Text variant="label-default-s" onBackground="neutral-weak">
            Room
          </Text>
          <Row fillWidth gap="s" horizontal="between" vertical="center">
            <Text variant="body-default-m" onBackground="neutral-strong">{roomCode}</Text>
            <Row
              gap="xs"
              paddingX="s"
              paddingY="2"
              background="page"
              border="neutral-alpha-weak"
              vertical="center"
              horizontal="center"
              onClick={onCopyRoomCode}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease', borderRadius: '9999px' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--neutral-alpha-weak)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
              }}
            >
              <Icon name="copy" onBackground="neutral-medium" size="xs" />
            </Row>
          </Row>
        </Column>

        <Row fillWidth gap="s">
          <Column flex={1} gap="xs" padding="m" background="surface" border="neutral-medium" style={{ borderRadius: '16px' }}>
            <Text variant="label-default-xs" onBackground="neutral-weak">
              You
            </Text>
            <Text variant="body-default-s" onBackground="neutral-strong">
              {playerColor === 'w' ? 'White' : 'Black'}
            </Text>
          </Column>

          <Column flex={1} gap="xs" padding="m" background="surface" border="neutral-medium" style={{ borderRadius: '16px' }}>
            <Text variant="label-default-xs" onBackground="neutral-weak">
              Opponent
            </Text>
            <Row gap="xs" vertical="center">
              <Text variant="body-default-s" onBackground="neutral-strong">{opponentName || 'Unknown'}</Text>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: opponentConnected ? 'var(--brand-medium)' : 'var(--neutral-medium)' }} />
            </Row>
          </Column>
        </Row>

        {/* Timer Display (if time control is set) */}
        {whiteTime && blackTime && !whiteTime.includes('Infinity') && !whiteTime.includes('NaN') && (
          <ChessTimer
            whiteTime={whiteTime}
            blackTime={blackTime}
            activeColor={timerActive || null}
            playerColor={playerColor || undefined}
            layout="stacked"
          />
        )}

        <Row fillWidth horizontal="center">
          <Badge
            background={isMyTurn ? 'brand-alpha-weak' : 'neutral-alpha-weak'}
            onBackground={isMyTurn ? 'brand-strong' : 'neutral-strong'}
            arrow={false}
          >
            {isMyTurn ? "Your turn" : "Opponent's turn"}
          </Badge>
        </Row>

        <Row
          fillWidth
          gap="xs"
          paddingX="m"
          paddingY="s"
          background="surface"
          border="neutral-medium"
          vertical="center"
          horizontal="center"
          onClick={onLeaveRoom}
          style={{ cursor: 'pointer', transition: 'all 0.2s ease', borderRadius: '9999px' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--neutral-alpha-weak)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
          }}
        >
          <Icon name="close" onBackground="neutral-medium" />
          <Text variant="label-default-s">Leave Game</Text>
        </Row>
      </Column>
    );
  }

  return null;
};

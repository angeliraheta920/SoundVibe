/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Sidebar } from './components/Navigation/Sidebar';
import { RightSidebar } from './components/Navigation/RightSidebar';
import { Header } from './components/Navigation/Header';
import { MobileNav } from './components/Navigation/MobileNav';
import { BottomPlayer } from './components/Player/BottomPlayer';
import { AudioVisualizerModal } from './components/Player/AudioVisualizerModal';
import { GroupSessionModal } from './components/Modals/GroupSessionModal';
import { AudioSettingsModal } from './components/Modals/AudioSettingsModal';
import { CreateVoiceRoomModal } from './components/Modals/CreateVoiceRoomModal';
import { InicioScreen } from './components/Screens/InicioScreen';
import { ExplorarScreen } from './components/Screens/ExplorarScreen';
import { VoiceRoomsScreen } from './components/Screens/VoiceRoomsScreen';
import { BibliotecaScreen } from './components/Screens/BibliotecaScreen';
import { ChatsScreen } from './components/Screens/ChatsScreen';

const MainContent: React.FC = () => {
  const { currentScreen } = usePlayer();

  return (
    <div className="min-h-screen bg-[#121317] text-[#e3e2e7] flex flex-col">
      {/* Desktop Left Navigation */}
      <Sidebar />

      {/* Top Header Bar */}
      <Header />

      {/* Main Viewport Container */}
      <div className="lg:pl-64 xl:pr-72 w-full min-h-screen flex flex-col">
        <main className="w-full pt-20 pb-44 lg:pb-32 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1">
          {currentScreen === 'inicio' && <InicioScreen />}
          {currentScreen === 'explorar' && <ExplorarScreen />}
          {currentScreen === 'voicerooms' && <VoiceRoomsScreen />}
          {currentScreen === 'biblioteca' && <BibliotecaScreen />}
          {currentScreen === 'chats' && <ChatsScreen />}
        </main>
      </div>

      {/* Desktop Right Activity Sidebar */}
      <RightSidebar />

      {/* Bottom Persistent Audio Player */}
      <BottomPlayer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Interactive Global Modals */}
      <AudioVisualizerModal />
      <GroupSessionModal />
      <AudioSettingsModal />
      <CreateVoiceRoomModal />
    </div>
  );
};

export default function App() {
  return (
    <PlayerProvider>
      <MainContent />
    </PlayerProvider>
  );
}

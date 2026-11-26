
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  LayoutDashboard,
  Globe2,
  Volume2,
  CalendarDays,
  Timer,
  CheckSquare,
  NotebookPen,
  BarChart3,
  Settings,
  Search,
  Bell,
  Heart,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Flame,
  Clock,
  Coffee,
  BookOpen,
  Mountain,
  Sparkles,
  Check,
  Menu,
  X,
  Headphones,
  MoreHorizontal,
  Music2,
  SkipBack,
  SkipForward,
} from "lucide-react";

// ==========================================
// TYPES
// ==========================================

type Space = {
  id: number;
  name: string;
  location: string;
  category: string;
  image: string;
  description: string;
};

type Task = {
  id: number;
  title: string;
  category: string;
  done: boolean;
};

type TimerMode = "Focus" | "Short Break" | "Long Break";

type TimerSettings = {
  focus: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
};

const defaultTimerSettings: TimerSettings = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

// ==========================================
// MUSIC URL CONVERTER
// ==========================================

function getMusicEmbedUrl(link: string): string {
  try {
    const url = new URL(link.trim());
    const hostname = url.hostname.toLowerCase();

    // YouTube
    if (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtu.be" ||
      hostname === "www.youtube-nocookie.com"
    ) {
      const videoId =
        hostname === "youtu.be"
          ? url.pathname.slice(1).split("/")[0]
          : url.searchParams.get("v") ||
            url.pathname.match(
              /\/(?:embed|shorts|live)\/([^/?]+)/
            )?.[1];

      const playlistId = url.searchParams.get("list");

      if (videoId) {
        return `https://www.youtube.com/embed/${encodeURIComponent(
          videoId
        )}${
          playlistId
            ? `?list=${encodeURIComponent(playlistId)}`
            : ""
        }`;
      }

      if (playlistId) {
        return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(
          playlistId
        )}`;
      }
    }

    // Spotify
    if (
      hostname === "open.spotify.com" ||
      hostname === "www.spotify.com" ||
      hostname === "spotify.com"
    ) {
      const match = url.pathname.match(
        /^\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/
      );

      if (match) {
        return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
      }
    }
  } catch {
    return "";
  }

  return "";
}

// ==========================================
// SCENIC ENVIRONMENTS
// ==========================================

const spaces: Space[] = [
  {
    id: 1,
    name: "Mountain Escape",
    location: "Swiss Alps",
    category: "Nature",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900&q=85",
    description: "Peaceful mountain scenery",
  },
  {
    id: 2,
    name: "Rainy Cafe",
    location: "Amsterdam",
    category: "Cafe",
    image:
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=900&q=85",
    description: "Cozy coffee shop ambience",
  },
  {
    id: 3,
    name: "Forest Retreat",
    location: "Bali, Indonesia",
    category: "Nature",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=85",
    description: "Deep forest atmosphere",
  },
  {
    id: 4,
    name: "Quiet Library",
    location: "Oxford, UK",
    category: "Study",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&q=85",
    description: "A peaceful place to study",
  },
  {
    id: 5,
    name: "Ocean View",
    location: "Maldives",
    category: "Nature",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85",
    description: "Relaxing ocean atmosphere",
  },
  {
    id: 6,
    name: "Minimal Workspace",
    location: "Tokyo, Japan",
    category: "Study",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=85",
    description: "Clean and minimal workspace",
  },
  {
    id: 7,
    name: "Coffee & Books",
    location: "Copenhagen",
    category: "Cafe",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=85",
    description: "Warm cafe atmosphere",
  },
  {
    id: 8,
    name: "Japanese Garden",
    location: "Kyoto, Japan",
    category: "Nature",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=85",
    description: "Calm traditional scenery",
  },
];

// ==========================================
// NAVIGATION
// ==========================================

const navigation = [
  { label: "Home", icon: LayoutDashboard },
  { label: "Spaces", icon: Globe2 },
  { label: "Sounds", icon: Volume2 },
  { label: "Calendar", icon: CalendarDays },
  { label: "Timer", icon: Timer },
  { label: "Tasks", icon: CheckSquare },
  { label: "Notes", icon: NotebookPen },
  { label: "Analytics", icon: BarChart3 },
];

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Study TypeScript fundamentals",
    category: "Study",
    done: false,
  },
  {
    id: 2,
    title: "Complete LifeOS development",
    category: "Development",
    done: false,
  },
  {
    id: 3,
    title: "Read 20 pages",
    category: "Personal",
    done: true,
  },
];

// ==========================================
// MAIN APPLICATION
// ==========================================

export default function Home() {
  // Navigation
  const [activeNav, setActiveNav] = useState("Spaces");
  const [activeTab, setActiveTab] = useState("Spaces");

  // Environments
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([1]);
  const [selectedSpace, setSelectedSpace] = useState<Space>(
    spaces[0]
  );

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState("");

  // Timer
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>("Focus");

  const [timerSettings, setTimerSettings] =
    useState<TimerSettings>(defaultTimerSettings);

  const [settingsDraft, setSettingsDraft] =
    useState<TimerSettings>(defaultTimerSettings);

  const [seconds, setSeconds] = useState(
    defaultTimerSettings.focus * 60
  );

  const [completedSessions, setCompletedSessions] = useState(0);
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [showTimerSettings, setShowTimerSettings] = useState(false);

  // Music
  const [musicLink, setMusicLink] = useState("");
  const [activeMusicUrl, setActiveMusicUrl] = useState("");
  const [musicError, setMusicError] = useState("");
  const [musicSource, setMusicSource] = useState<
    "YouTube" | "Spotify"
  >("YouTube");
  const [showMusicPlayer, setShowMusicPlayer] = useState(true);

  // Interface
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [clock, setClock] = useState("");

  // ========================================
  // TIMER HELPER
  // ========================================

  function getDuration(
    mode: TimerMode,
    settings: TimerSettings = timerSettings
  ) {
    if (mode === "Focus") return settings.focus;
    if (mode === "Short Break") return settings.shortBreak;
    return settings.longBreak;
  }

  // ========================================
  // LOCAL CLOCK
  // ========================================

  useEffect(() => {
    const updateClock = () => {
      setClock(
        new Date().toLocaleTimeString("en-MY", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    updateClock();

    const interval = window.setInterval(updateClock, 30000);

    return () => window.clearInterval(interval);
  }, []);

  // ========================================
  // LOAD SAVED TIMER AND MUSIC SETTINGS
  // ========================================

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(
        "lifeos-timer-settings"
      );

      const savedMusic = localStorage.getItem("lifeos-music-link");

      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);

        const validSettings: TimerSettings = {
          focus: Math.min(
            180,
            Math.max(5, Number(parsed.focus) || 25)
          ),
          shortBreak: Math.min(
            60,
            Math.max(1, Number(parsed.shortBreak) || 5)
          ),
          longBreak: Math.min(
            60,
            Math.max(1, Number(parsed.longBreak) || 15)
          ),
          longBreakInterval: Math.min(
            10,
            Math.max(2, Number(parsed.longBreakInterval) || 4)
          ),
        };

        setTimerSettings(validSettings);
        setSettingsDraft(validSettings);
        setSeconds(validSettings.focus * 60);
      }

      if (savedMusic) {
        setMusicLink(savedMusic);

        const embedUrl = getMusicEmbedUrl(savedMusic);

        if (embedUrl) {
          setActiveMusicUrl(embedUrl);
          setMusicSource(
            savedMusic.includes("spotify.com")
              ? "Spotify"
              : "YouTube"
          );
        }
      }
    } catch {
      console.error("Could not load LifeOS preferences.");
    }
  }, []);

  // ========================================
  // SAVE TIMER SETTINGS
  // ========================================

  useEffect(() => {
    localStorage.setItem(
      "lifeos-timer-settings",
      JSON.stringify(timerSettings)
    );
  }, [timerSettings]);

  // ========================================
  // SAVE MUSIC LINK
  // ========================================

  useEffect(() => {
    localStorage.setItem("lifeos-music-link", musicLink);
  }, [musicLink]);

  // ========================================
  // FOCUS TIMER
  // ========================================

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;

    const timerInterval = window.setTimeout(() => {
      if (seconds === 1) {
        setSeconds(0);
        setIsRunning(false);

        if (timerMode === "Focus") {
          setSessionMinutes(
            (previous) => previous + timerSettings.focus
          );

          const nextCount = completedSessions + 1;

          setCompletedSessions(nextCount);

          const nextMode: TimerMode =
            nextCount % timerSettings.longBreakInterval === 0
              ? "Long Break"
              : "Short Break";

          setTimerMode(nextMode);
          setSeconds(getDuration(nextMode) * 60);
        } else {
          setTimerMode("Focus");
          setSeconds(timerSettings.focus * 60);
        }
      } else {
        setSeconds((previous) => previous - 1);
      }
    }, 1000);

    return () => window.clearTimeout(timerInterval);
  }, [
    isRunning,
    seconds,
    timerMode,
    timerSettings,
    completedSessions,
  ]);

  // ========================================
  // FILTER ENVIRONMENTS
  // ========================================

  const filteredSpaces = spaces.filter((space) => {
    const matchesSearch =
      space.name.toLowerCase().includes(search.toLowerCase()) ||
      space.location.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      space.category === activeCategory;

    const matchesTab =
      activeTab !== "Favorites" ||
      favorites.includes(space.id);

    return matchesSearch && matchesCategory && matchesTab;
  });

  // ========================================
  // TASK STATISTICS
  // ========================================

  const completedTasks = tasks.filter((task) => task.done).length;

  const progress = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  // ========================================
  // TIMER FORMAT
  // ========================================

  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60);
    const remainingSeconds = value % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // ========================================
  // TIMER CONTROLS
  // ========================================

  function selectTimerMode(mode: TimerMode) {
    setIsRunning(false);
    setTimerMode(mode);
    setSeconds(getDuration(mode) * 60);
  }

  function toggleTimer() {
    if (seconds === 0) {
      setSeconds(getDuration(timerMode) * 60);
    }

    setIsRunning((previous) => !previous);
  }

  function resetTimer() {
    setIsRunning(false);
    setSeconds(getDuration(timerMode) * 60);
  }

  function saveTimerSettings() {
    const cleanedSettings: TimerSettings = {
      focus: Math.min(
        180,
        Math.max(5, Number(settingsDraft.focus) || 25)
      ),
      shortBreak: Math.min(
        60,
        Math.max(1, Number(settingsDraft.shortBreak) || 5)
      ),
      longBreak: Math.min(
        60,
        Math.max(1, Number(settingsDraft.longBreak) || 15)
      ),
      longBreakInterval: Math.min(
        10,
        Math.max(2, Number(settingsDraft.longBreakInterval) || 4)
      ),
    };

    setIsRunning(false);
    setTimerSettings(cleanedSettings);
    setTimerMode("Focus");
    setSeconds(cleanedSettings.focus * 60);
    setShowTimerSettings(false);
  }

  // ========================================
  // FAVORITES
  // ========================================

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  // ========================================
  // TASK MANAGEMENT
  // ========================================

  function addTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now(),
      title: newTask.trim(),
      category: "Personal",
      done: false,
    };

    setTasks((current) => [...current, task]);
    setNewTask("");
  }

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, done: !task.done }
          : task
      )
    );
  }

  // ========================================
  // MUSIC PLAYER
  // ========================================

  function loadMusic() {
    const embedUrl = getMusicEmbedUrl(musicLink);

    if (!embedUrl) {
      setMusicError(
        "Please enter a valid YouTube video, playlist or Spotify link."
      );
      return;
    }

    setMusicError("");
    setActiveMusicUrl(embedUrl);
    setMusicSource(
      musicLink.includes("spotify.com") ? "Spotify" : "YouTube"
    );
    setShowMusicPlayer(true);
  }

  function openSounds() {
    setActiveNav("Sounds");
    setActiveTab("Sounds");
    setShowMusicPlayer(true);

    document
      .getElementById("spaces-section")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  // ========================================
  // NAVIGATION
  // ========================================

  function changeNav(label: string) {
    setActiveNav(label);

    if (label === "Spaces" || label === "Sounds") {
      setActiveTab(label);
    }

    if (label === "Home") {
      setActiveTab("Spaces");
      setActiveCategory("All");
      setSearch("");
    }

    if (label === "Tasks") {
      document
        .getElementById("tasks-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }

    if (label === "Timer") {
      document
        .getElementById("focus-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }

    if (label === "Sounds") {
      setShowMusicPlayer(true);
    }

    setShowMobileMenu(false);
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <main className="lifeos-shell">
      {/* SCENIC BACKGROUND */}

      <div
        className="scenic-background"
        style={{
          backgroundImage: `url(${selectedSpace.image})`,
        }}
      />

      <div className="scenic-overlay" />

      {/* LEFT SIDEBAR */}

      <aside
        className={`sidebar ${
          showMobileMenu ? "sidebar-open" : ""
        }`}
      >
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={21} />
          </div>

          <div>
            <h1>LifeOS</h1>
            <span>YOUR PERSONAL SPACE</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setShowMobileMenu(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="nav-list">
          {navigation.map((item) => (
            <button
              key={item.label}
              onClick={() => changeNav(item.label)}
              className={`nav-item ${
                activeNav === item.label ? "nav-active" : ""
              }`}
            >
              <item.icon size={19} strokeWidth={1.8} />
              <span>{item.label}</span>

              {activeNav === item.label && (
                <span className="nav-indicator" />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-profile">
            <div className="profile-avatar">H</div>

            <div className="profile-info">
              <strong>My Workspace</strong>
              <span>Personal account</span>
            </div>

            <MoreHorizontal size={18} />
          </div>

          <button className="nav-item settings-item">
            <Settings size={19} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* MOBILE BACKDROP */}

      {showMobileMenu && (
        <button
          className="mobile-backdrop"
          onClick={() => setShowMobileMenu(false)}
          aria-label="Close navigation"
        />
      )}

      {/* MAIN LAYOUT */}

      <div className="main-layout">
        {/* TOP BAR */}

        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-button"
              onClick={() => setShowMobileMenu(true)}
            >
              <Menu size={21} />
            </button>

            <div className="breadcrumb">
              <span>My Workspace</span>
              <span className="breadcrumb-divider">/</span>
              <strong>{activeNav}</strong>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="streak-pill">
              <Flame size={16} />
              <strong>1</strong>
              <span>day streak</span>
            </div>

            <button
              className="notification-button"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span />
            </button>

            <div className="top-avatar">H</div>
          </div>
        </header>

        {/* WORKSPACE CONTENT */}

        <div className="workspace-grid">
          <section className="main-column">
            {/* WELCOME SECTION */}

            <div className="welcome-section">
              <div>
                <p className="eyebrow">
                  YOUR PERSONAL PRODUCTIVITY SPACE
                </p>

                <h2>
                  A little progress, <em>every day.</em> ✨
                </h2>

                <p className="welcome-description">
                  Find your focus. Create your rhythm. Make today count.
                </p>
              </div>

              <div className="current-time">
                <span>{clock || "Welcome"}</span>
                <small>LOCAL TIME</small>
              </div>
            </div>

            {/* FEATURED SCENIC HERO */}

            <div
              className="hero-card"
              style={{
                backgroundImage: `url(${selectedSpace.image})`,
              }}
            >
              <div className="hero-shade" />

              <div className="hero-content">
                <div className="hero-badge">
                  <Sparkles size={13} />
                  YOUR CURRENT ENVIRONMENT
                </div>

                <h2>{selectedSpace.name}</h2>

                <p>
                  {selectedSpace.location} ·{" "}
                  {selectedSpace.description}
                </p>

                <button
                  className="hero-button"
                  onClick={() => {
                    setActiveNav("Spaces");
                    setActiveTab("Spaces");

                    document
                      .getElementById("spaces-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore spaces <span>↗</span>
                </button>
              </div>

              <div className="hero-location">
                <Globe2 size={14} />
                {selectedSpace.category}
              </div>
            </div>

            {/* SPACES PANEL */}

            <section
              className="glass-panel spaces-panel"
              id="spaces-section"
            >
              <div className="panel-heading">
                <div className="panel-tabs">
                  {["Spaces", "Sounds", "Favorites"].map((tab) => (
                    <button
                      key={tab}
                      className={`panel-tab ${
                        activeTab === tab ? "tab-active" : ""
                      }`}
                      onClick={() => {
                        setActiveTab(tab);
                        if (tab === "Sounds") {
                          setActiveNav("Sounds");
                          setShowMusicPlayer(true);
                        }
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button
                  className="view-all-button"
                  onClick={() => {
                    setActiveTab("Spaces");
                    setActiveNav("Spaces");
                    setActiveCategory("All");
                    setSearch("");
                  }}
                >
                  Explore all <span>↗</span>
                </button>
              </div>

              {/* SEARCH */}

              <div className="search-box">
                <Search size={18} />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Find your perfect environment..."
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* CATEGORIES */}

              <div className="category-list">
                {[
                  { name: "All", icon: Sparkles },
                  { name: "Nature", icon: Mountain },
                  { name: "Cafe", icon: Coffee },
                  { name: "Study", icon: BookOpen },
                ].map((category) => (
                  <button
                    key={category.name}
                    onClick={() =>
                      setActiveCategory(category.name)
                    }
                    className={`category-button ${
                      activeCategory === category.name
                        ? "category-active"
                        : ""
                    }`}
                  >
                    <category.icon size={15} />
                    {category.name}
                  </button>
                ))}
              </div>

              {/* FEATURED HEADING */}

              <div className="featured-heading">
                <div>
                  <h3>
                    {activeTab === "Favorites"
                      ? "Your Favorites"
                      : activeTab === "Sounds"
                        ? "Music & Ambient Sounds"
                        : "Featured Environments"}
                  </h3>

                  <p>
                    {activeTab === "Sounds"
                      ? "Listen to your favourite music while you work"
                      : "Choose a place that inspires you"}
                  </p>
                </div>

                <span>
                  {activeTab === "Sounds"
                    ? "Music player"
                    : `${filteredSpaces.length} spaces`}
                </span>
              </div>

              {/* MUSIC LIBRARY */}

              {activeTab === "Sounds" ? (
                <div className="music-library">
                  <div className="sound-icon">
                    <Headphones size={30} />
                  </div>

                  <h3>Your personal music space</h3>

                  <p>
                    Play your favourite music while you focus.
                  </p>

                  <div className="music-source-options">
                    <button
                      className={
                        musicSource === "YouTube"
                          ? "music-source-active"
                          : ""
                      }
                      onClick={() => {
                        setMusicSource("YouTube");
                        setMusicError("");
                      }}
                    >
                      <Play size={15} />
                      YouTube
                    </button>

                    <button
                      className={
                        musicSource === "Spotify"
                          ? "music-source-active"
                          : ""
                      }
                      onClick={() => {
                        setMusicSource("Spotify");
                        setMusicError("");
                      }}
                    >
                      <Music2 size={15} />
                      Spotify
                    </button>
                  </div>

                  <div className="music-link-form">
                    <input
                      value={musicLink}
                      onChange={(e) => {
                        setMusicLink(e.target.value);
                        setMusicError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") loadMusic();
                      }}
                      placeholder={
                        musicSource === "YouTube"
                          ? "Paste a YouTube video or playlist link..."
                          : "Paste a Spotify track or playlist link..."
                      }
                    />

                    <button onClick={loadMusic}>
                      <Play size={15} />
                      Load music
                    </button>
                  </div>

                  {musicError && (
                    <p className="music-error">{musicError}</p>
                  )}

                  {activeMusicUrl && (
                    <div className="music-loaded-message">
                      <Check size={15} />
                      Music loaded in your bottom player.
                    </div>
                  )}

                  <div className="music-help">
                    <p>
                      YouTube: paste a video or playlist URL.
                    </p>
                    <p>
                      Spotify: paste a track, album or playlist URL.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="spaces-grid">
                  {filteredSpaces.map((space) => (
                    <article
                      key={space.id}
                      className={`space-card ${
                        selectedSpace.id === space.id
                          ? "space-selected"
                          : ""
                      }`}
                    >
                      <button
                        className="space-image"
                        style={{
                          backgroundImage: `url(${space.image})`,
                        }}
                        onClick={() => setSelectedSpace(space)}
                        aria-label={`Select ${space.name}`}
                      >
                        <span className="image-label">
                          {space.category}
                        </span>
                      </button>

                      <button
                        className={`favorite-button ${
                          favorites.includes(space.id)
                            ? "favorite-active"
                            : ""
                        }`}
                        onClick={() => toggleFavorite(space.id)}
                        aria-label={`Toggle ${space.name} favorite`}
                      >
                        <Heart
                          size={19}
                          fill={
                            favorites.includes(space.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>

                      <button
                        className="space-caption"
                        onClick={() => setSelectedSpace(space)}
                      >
                        <strong>{space.name}</strong>
                        <span>{space.location}</span>
                      </button>
                    </article>
                  ))}
                </div>
              )}

              {/* EMPTY STATE */}

              {filteredSpaces.length === 0 &&
                activeTab !== "Sounds" && (
                  <div className="empty-state">
                    <Search size={25} />
                    <p>
                      No environments found. Try another search.
                    </p>
                  </div>
                )}

              <div className="spaces-footer">
                <span>
                  Find the environment that fits your mood.
                </span>

                <span>Made for better focus ♡</span>
              </div>
            </section>

            {/* TASK SECTION */}

            <section
              className="glass-panel tasks-panel"
              id="tasks-section"
            >
              <div className="section-title-row">
                <div>
                  <span className="eyebrow">STAY ON TRACK</span>
                  <h3>Today's tasks</h3>
                  <p>
                    {completedTasks} of {tasks.length} completed
                  </p>
                </div>

                <div className="task-progress">
                  <strong>{progress}%</strong>
                  <span>complete</span>
                </div>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <form
                className="add-task-form"
                onSubmit={addTask}
              >
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="What would you like to accomplish?"
                />

                <button type="submit">
                  <Plus size={18} />
                  Add task
                </button>
              </form>

              <div className="task-list">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    className={`task-row ${
                      task.done ? "task-done" : ""
                    }`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <span className="task-check">
                      {task.done && <Check size={13} />}
                    </span>

                    <span className="task-name">
                      {task.title}
                    </span>

                    <span className="task-category">
                      {task.category}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </section>

          {/* RIGHT COLUMN */}

          <aside className="right-column">
            {/* FOCUS PANEL */}

            <section
              className="glass-panel focus-panel"
              id="focus-section"
            >
              <div className="right-panel-heading">
                <div>
                  <span className="eyebrow">YOUR DEEP WORK</span>
                  <h3>Focus session</h3>
                </div>

                <button
                  className="more-button"
                  onClick={() => {
                    setSettingsDraft(timerSettings);
                    setShowTimerSettings(true);
                  }}
                  aria-label="Timer settings"
                  title="Timer settings"
                >
                  <Settings size={18} />
                </button>
              </div>

              {/* SELECTED ENVIRONMENT */}

              <div className="focus-environment">
                <div
                  className="focus-environment-image"
                  style={{
                    backgroundImage: `url(${selectedSpace.image})`,
                  }}
                />

                <div>
                  <span>STUDYING IN</span>
                  <strong>{selectedSpace.name}</strong>
                </div>

                <Sparkles size={16} />
              </div>

              {/* TIMER */}

              <div className="timer-area">
                <div className="timer-ring">
                  <svg viewBox="0 0 220 220">
                    <circle
                      cx="110"
                      cy="110"
                      r="96"
                      className="timer-track"
                    />

                    <circle
                      cx="110"
                      cy="110"
                      r="96"
                      className="timer-progress"
                      style={{
                        strokeDasharray: 603.19,
                        strokeDashoffset:
                          603.19 *
                          (1 -
                            seconds /
                              (getDuration(timerMode) * 60)),
                      }}
                    />
                  </svg>

                  <div className="timer-value">
                    <strong>{formatTime(seconds)}</strong>

                    <span>
                      {isRunning
                        ? timerMode === "Focus"
                          ? "STAY FOCUSED"
                          : "TAKE A BREAK"
                        : seconds === 0
                          ? "SESSION COMPLETED"
                          : `${timerMode.toUpperCase()} TIME`}
                    </span>
                  </div>
                </div>

                {/* TIMER MODE SELECTOR */}

                <div className="timer-mode-selector">
                  {(
                    [
                      "Focus",
                      "Short Break",
                      "Long Break",
                    ] as TimerMode[]
                  ).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => selectTimerMode(mode)}
                      className={
                        timerMode === mode ? "preset-active" : ""
                      }
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {/* TIMER CONTROLS */}

                <div className="timer-controls">
                  <button
                    className="timer-reset"
                    onClick={resetTimer}
                    aria-label="Reset timer"
                  >
                    <RotateCcw size={18} />
                  </button>

                  <button
                    className="timer-start"
                    onClick={toggleTimer}
                  >
                    {isRunning ? (
                      <Pause size={19} fill="currentColor" />
                    ) : (
                      <Play size={19} fill="currentColor" />
                    )}

                    {isRunning
                      ? "Pause session"
                      : "Start session"}
                  </button>
                </div>
              </div>

              <div className="focus-note">
                <Sparkles size={15} />
                <span>
                  {timerMode === "Focus"
                    ? "One thing at a time. You've got this."
                    : "Take a breath. You deserve a break."}
                </span>
              </div>
            </section>

            {/* STATISTICS */}

            <section className="glass-panel stats-panel">
              <div className="right-panel-heading">
                <div>
                  <span className="eyebrow">YOUR PROGRESS</span>
                  <h3>Today's activity</h3>
                </div>

                <BarChart3 size={19} className="muted-icon" />
              </div>

              <div className="activity-stat">
                <div className="stat-icon purple-stat">
                  <Clock size={18} />
                </div>

                <div>
                  <strong>
                    {Math.floor(sessionMinutes / 60)}h{" "}
                    {sessionMinutes % 60}m
                  </strong>
                  <span>Tracked focus time</span>
                </div>
              </div>

              <div className="activity-stat">
                <div className="stat-icon orange-stat">
                  <Flame size={18} />
                </div>

                <div>
                  <strong>{completedSessions} sessions</strong>
                  <span>Completed focus sessions</span>
                </div>
              </div>

              <div className="activity-stat">
                <div className="stat-icon green-stat">
                  <CheckSquare size={18} />
                </div>

                <div>
                  <strong>
                    {completedTasks}/{tasks.length}
                  </strong>
                  <span>Tasks completed</span>
                </div>
              </div>
            </section>

            {/* MOTIVATIONAL QUOTE */}

            <section className="quote-card">
              <Sparkles size={19} />

              <p>
                "Almost everything will work again if you unplug
                it for a few minutes, including you."
              </p>

              <span>— ANNE LAMOTT</span>
            </section>
          </aside>
        </div>

        {/* FOOTER */}

        <footer className="app-footer">
          <span>LifeOS © 2026</span>
          <span>Make space for what matters. 🌿</span>
        </footer>
      </div>

      {/* =====================================
          TIMER SETTINGS MODAL
      ===================================== */}

      {showTimerSettings && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowTimerSettings(false);
            }
          }}
        >
          <div
            className="timer-settings-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="timer-settings-title"
          >
            <div className="modal-heading">
              <div>
                <span className="eyebrow">
                  PERSONALISE YOUR ROUTINE
                </span>
                <h3 id="timer-settings-title">Timer settings</h3>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowTimerSettings(false)}
                aria-label="Close settings"
              >
                <X size={20} />
              </button>
            </div>

            <label className="setting-field">
              <span>Focus duration (minutes)</span>
              <input
                type="number"
                min="5"
                max="180"
                value={settingsDraft.focus}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    focus: Number(e.target.value),
                  })
                }
              />
            </label>

            <label className="setting-field">
              <span>Short break (minutes)</span>
              <input
                type="number"
                min="1"
                max="60"
                value={settingsDraft.shortBreak}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    shortBreak: Number(e.target.value),
                  })
                }
              />
            </label>

            <label className="setting-field">
              <span>Long break (minutes)</span>
              <input
                type="number"
                min="1"
                max="60"
                value={settingsDraft.longBreak}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    longBreak: Number(e.target.value),
                  })
                }
              />
            </label>

            <label className="setting-field">
              <span>
                Long break after how many focus sessions?
              </span>
              <input
                type="number"
                min="2"
                max="10"
                value={settingsDraft.longBreakInterval}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    longBreakInterval: Number(e.target.value),
                  })
                }
              />
            </label>

            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setShowTimerSettings(false)}
              >
                Cancel
              </button>

              <button
                className="modal-save"
                onClick={saveTimerSettings}
              >
                Save settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================
          FIXED BOTTOM MUSIC PLAYER
      ===================================== */}

      {showMusicPlayer && (
        <div
          className={`music-dock ${
            activeMusicUrl ? "music-dock-loaded" : ""
          }`}
        >
          <div className="music-dock-info">
            <div className="music-dock-icon">
              <Headphones size={20} />
            </div>

            <div>
              <strong>
                {activeMusicUrl ? "Now Playing" : "LifeOS Music"}
              </strong>
              <span>
                {activeMusicUrl
                  ? `${musicSource} embedded player`
                  : "Choose your focus soundtrack"}
              </span>
            </div>
          </div>

          {activeMusicUrl ? (
            <iframe
              src={activeMusicUrl}
              title="LifeOS music player"
              className={`music-embed ${
                musicSource === "Spotify"
                  ? "spotify-embed"
                  : "youtube-embed"
              }`}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          ) : (
            <button
              className="music-dock-button"
              onClick={openSounds}
            >
              Choose music <Headphones size={16} />
            </button>
          )}

          <button
            className="music-dock-close"
            onClick={() => setShowMusicPlayer(false)}
            aria-label="Hide music player"
            title="Hide music player"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* SHOW MUSIC PLAYER AGAIN */}

      {!showMusicPlayer && (
        <button
          className="music-reopen-button"
          onClick={() => setShowMusicPlayer(true)}
          aria-label="Show music player"
          title="Show music player"
        >
          <Music2 size={19} />
        </button>
      )}
    </main>
  );
}

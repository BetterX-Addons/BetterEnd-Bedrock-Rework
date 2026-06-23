import * as mc from "@minecraft/server";

// ─────────────────────────────────────────────────────────────
//  Biomas de superficie
// ─────────────────────────────────────────────────────────────
export const BiomeTags = [
  {
    tag: 'amber_land',
    fog: 'betterend:amber_land_fog_setting',
    ambientSound: 'betterend.ambient.amber_land',
    moodSound:    'betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend.music.forest',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'blossoming_spire',
    fog: 'betterend:blossoming_spire_fog_setting',
    ambientSound: 'betterend.ambient.blossoming_spires',
    moodSound:    'betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend.music.forest',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'chorus_forest',
    fog: 'betterend:chorus_forest_fog_setting',
    ambientSound: 'betterend:betterend.ambient.chorus_forest',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.dark',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'crystal_mountains',
    fog: 'betterend:crystal_mountains_fog_setting',
    ambientSound: null,
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.openspace',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'dragon_graveyards',
    fog: 'betterend:dragon_graveyards_fog_setting',
    ambientSound: 'betterend:betterend.ambient.glowing_grasslands',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.openspace',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'dry_shrubland',
    fog: 'betterend:dry_shrubland_fog_setting',
    ambientSound: null,
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.openspace',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'dust_wasteland',
    fog: 'betterend:desert_fog_setting',
    ambientSound: 'betterend:betterend.ambient.dust_wastelands',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.openspace',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'foggy_mushroomland',
    fog: 'betterend:foggy_mushroomland_fog_setting',
    ambientSound: 'betterend:betterend.ambient.foggy_mushroomland',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.forest',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'glowing_grasslands',
    fog: 'betterend:glowing_grasslands_fog_setting',
    ambientSound: 'betterend:betterend.ambient.glowing_grasslands',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.openspace',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'ice_starfield',
    fog: 'betterend:ice_starfield_fog_setting',
    ambientSound: null,
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'minecraft:music.end',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'lantern_woods',
    fog: 'betterend:lantern_woods_fog_setting',
    ambientSound: null,
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.forest',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'megalake',
    fog: 'betterend:megalakes_fog_setting',
    ambientSound: 'betterend:betterend.ambient.megalake',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.water',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'megalakes_grove',
    fog: 'betterend:megalakes_fog_setting',
    ambientSound: 'betterend:betterend.ambient.megalake_grove',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.water',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'neon_oasis',
    fog: 'betterend:desert_fog_setting',
    ambientSound: 'betterend:betterend.ambient.dust_wastelands',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.openspace',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'painted_mountains',
    fog: 'betterend:crystal_mountains_fog_setting',
    ambientSound: 'betterend:betterend.ambient.dust_wastelands',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.openspace',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'shadow_forest',
    fog: 'betterend:shadow_forest_fog_setting',
    ambientSound: 'betterend:betterend.ambient.chorus_forest',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.dark',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'sulphur_springs',
    fog: 'betterend:sulphur_springs_fog_setting',
    ambientSound: 'betterend:betterend.ambient.sulphur_springs',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.openspace',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'umbra_valley',
    fog: 'betterend:umbra_valley_fog_setting',
    ambientSound: 'betterend:betterend.ambient.umbra_valley',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.dark',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'umbrella_jungle',
    fog: 'betterend:umbrella_jungle_fog_setting',
    ambientSound: 'betterend:betterend.ambient.umbrella_jungle',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.forest',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'none',
    fog: 'betterend:crystal_mountains_fog_setting',
    ambientSound: null,
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.caves',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'the_end_biome',
    fog: 'betterend:crystal_mountains_fog_setting',
    ambientSound: null,
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.caves',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
];

// ─────────────────────────────────────────────────────────────
//  Biomas de cuevas
// ─────────────────────────────────────────────────────────────
export const CaveBiomesTag = [
  {
    tag: 'empty_cave',
    fog: 'betterend:desert_fog_setting',
    ambientSound: 'betterend:betterend.ambient.caves',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.caves',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'jadestone',
    fog: 'betterend:jadestone_fog_setting',
    ambientSound: 'betterend:betterend.ambient.caves',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.caves',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'lush_cave',
    fog: 'betterend:lush_cave_fog_setting',
    ambientSound: 'betterend:betterend.ambient.caves',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.caves',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
  {
    tag: 'smaragdant',
    fog: 'betterend:smaragdant_cave_fog_setting',
    ambientSound: 'betterend:betterend.ambient.caves',
    moodSound:    'betterend:betterend.ambient.dust_wastelands',
    moodTickDelay: 6000,
    music:         'betterend:betterend.music.caves',
    musicMinDelay: 600,
    musicMaxDelay: 2400,
  },
];

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────
export const AllTags = [
  ...BiomeTags.map(b => b.tag),
  ...CaveBiomesTag.map(b => b.tag),
];

const NONE_FALLBACK = () => ({
  ...BiomeTags.find(b => b.tag === 'none'),
  biomeTag: 'none',
});

const playerMoodTimers  = new Map();
const playerMusicTimers = new Map();

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─────────────────────────────────────────────────────────────
//  Ciclo de mood sound
// ─────────────────────────────────────────────────────────────
function scheduleMoodSound(player, biome) {
  const id = player.id;
  const prev = playerMoodTimers.get(id);
  if (prev !== undefined) mc.system.clearRun(prev);

  const runId = mc.system.runTimeout(() => {
    if (!player.isValid) return;
    player.playSound(biome.moodSound, { location: player.location });
    scheduleMoodSound(player, biome);
  }, biome.moodTickDelay);

  playerMoodTimers.set(id, runId);
}

// ─────────────────────────────────────────────────────────────
//  Ciclo de música (con delay antes de cada reproducción,
//  incluyendo la primera — para no solaparse con stopsound)
// ─────────────────────────────────────────────────────────────
function scheduleMusic(player, biome) {
  const id = player.id;
  const prev = playerMusicTimers.get(id);
  if (prev !== undefined) mc.system.clearRun(prev);

  if (!biome.music || biome.music === 'none') return;

  function scheduleNext() {
    const delay = randomDelay(biome.musicMinDelay, biome.musicMaxDelay);
    const runId = mc.system.runTimeout(() => {
      if (!player.isValid) return;
      player.playSound(biome.music, { location: player.location, volume: 0.15 });
      scheduleNext();
    }, delay);
    playerMusicTimers.set(id, runId);
  }

  scheduleNext();
}

// ─────────────────────────────────────────────────────────────
//  Limpia timers del jugador
// ─────────────────────────────────────────────────────────────
function clearPlayerTimers(player) {
  const id = player.id;
  const mood = playerMoodTimers.get(id);
  if (mood !== undefined) { mc.system.clearRun(mood); playerMoodTimers.delete(id); }
  const music = playerMusicTimers.get(id);
  if (music !== undefined) { mc.system.clearRun(music); playerMusicTimers.delete(id); }
}

// ─────────────────────────────────────────────────────────────
//  Detección de bioma por tags de bloque
// ─────────────────────────────────────────────────────────────
export function getBiomeFromBlockTags(player) {
  const dim = player.dimension;
  if (dim.id !== 'minecraft:the_end') return undefined;

  const { x, y, z } = player.location;
  let caveResult = null;

  for (let i = Math.floor(y); i >= 0; i--) {
    const block = dim.getBlock({ x, y: i, z });
    if (!block) continue;

    for (const entry of BiomeTags) {
      if (block.hasTag(entry.tag)) {
        return { ...entry, biomeTag: entry.tag };
      }
    }

    if (block.typeId === 'minecraft:end_stone') {
      return NONE_FALLBACK();
    }

    if (!caveResult) {
      for (const entry of CaveBiomesTag) {
        if (block.hasTag(entry.tag)) {
          caveResult = { ...entry, biomeTag: entry.tag };
        }
      }
    }
  }

  return caveResult ?? NONE_FALLBACK();
}

// ─────────────────────────────────────────────────────────────
//  Aplica fog, ambient, mood y música al jugador
// ─────────────────────────────────────────────────────────────
export function applyFogAndMusic(player) {
  const biome = getBiomeFromBlockTags(player);
  if (!biome) return;

  const { fog, ambientSound, biomeTag } = biome;

  if (player.hasTag(biomeTag)) return;

  for (const tag of AllTags) player.removeTag(tag);
  player.addTag(biomeTag);
  clearPlayerTimers(player);

  player.runCommand(`fog @s remove end_fog`);
  player.runCommand(`fog @s push ${fog} end_fog`);
  player.runCommand(`stopsound @s`);
  player.runCommand(`music stop`);

  // Ambient al instante, sin timeout
  if (ambientSound) {
    player.playSound(ambientSound, { location: player.location });
  }

  // Mood y música con sus delays normales
  scheduleMoodSound(player, biome);
  scheduleMusic(player, biome);
}
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial seed places for offline / out-of-the-box local discovery
export const SEED_APPROVED_PLACES = [
  {
    id: "khonoma-sanctuary",
    name: "Khonoma Terraced Alder Sanctuary",
    state: "Nagaland",
    latitude: 25.651,
    longitude: 94.0205,
    photo_url:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    description:
      "India’s first green village, nestled amid ancient terraced hills and conserved community forests where logging and hunting were banned decades ago.",
    recommendation:
      "Walk early into the alder forests where farmers practice 200-year-old sustainable agroforestry. Visit the village fort (Semoma) at twilight.",
    best_season: "October to April",
    precautions:
      "Obtain ILP (Inner Line Permit) before entering Nagaland; respect village sanctuary rules regarding plastic waste and quiet hours.",
    contributor_name: "Kevisato Angami",
    status: "approved",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "dzukou-ridge",
    name: "Dzukou Valley North Ridge",
    state: "Nagaland",
    latitude: 25.5528,
    longitude: 94.0754,
    photo_url:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    description:
      "A high-altitude basin of rolling dwarf bamboo dunes, cold meandering streams, and rare endemic flora tucked at 2,450 meters.",
    recommendation:
      "Bypass the crowded visitor resthouse and camp near the natural caves on the north ridge to see the morning mist roll over the bamboo crests.",
    best_season:
      "June to September (for seasonal lilies) or November for winter frost",
    precautions:
      "Steep 4-hour hike with no paved road. Trek with warm layers, waterproof gear, and a registered local Angami guide.",
    contributor_name: "Thepfuvilie",
    status: "approved",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "mawryngkhang-trail",
    name: "Mawryngkhang Bamboo Cliff Trail",
    state: "Meghalaya",
    latitude: 25.295,
    longitude: 91.855,
    photo_url:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
    description:
      "A series of traditional bamboo skywalks constructed by Wahkhen villagers, clinging to towering granite gorges above roaring river ravines.",
    recommendation:
      "Cross the legendary King Rock (U Mawryngkhang). The craftsmanship of local Khasi bamboo artisans holding this trail together is astonishing.",
    best_season: "November to February",
    precautions:
      "Not recommended for those with severe vertigo or during heavy monsoon downpours. Sturdy shoes with grip are essential.",
    contributor_name: "Bantei Khongwir",
    status: "approved",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "nongriat-pools",
    name: "Nongriat Rainbow River Pools",
    state: "Meghalaya",
    latitude: 25.2505,
    longitude: 91.672,
    photo_url:
      "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80",
    description:
      "Natural crystalline turquoise swimming basins situated past the ancient double-decker living root bridges deep in the Umshiang canyon.",
    recommendation:
      "Bathe in the crystal mineral waters under towering Ficus elastica canopies. Homestays run by Khasi families serve fresh wild bay leaf tea.",
    best_season: "October to April",
    precautions:
      "Requires climbing over 3,000 stone steps down and up. Pack light and carry reusable water bottles to avoid plastic litter in the canyon.",
    contributor_name: "Daphisha Syiem",
    status: "approved",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "chamaguri-satra",
    name: "Chamaguri Satra Mask Artisan Cloister",
    state: "Assam",
    latitude: 26.962,
    longitude: 94.285,
    photo_url:
      "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80",
    description:
      "A centuries-old monastery on Majuli Island where master artisans preserve traditional Neo-Vaishnavite bamboo, clay, and cloth mask craftsmanship.",
    recommendation:
      "Sit with the Goswami family in their open courtyard studio while they weave pliable bamboo skeletons for traditional Bhaona folk plays.",
    best_season: "October to March",
    precautions:
      "Majuli is reached by river ferry from Nimati Ghat (Jorhat). Be respectful of monastery prayer hours and footwear customs.",
    contributor_name: "Pradip Goswami",
    status: "approved",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "panbari-corridor",
    name: "Panbari Wildlife Canopy Corridor",
    state: "Assam",
    latitude: 26.621,
    longitude: 93.284,
    photo_url:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    description:
      "A dense semi-evergreen canopy corridor adjacent to the Kaziranga floodplains, known for canopy birds and endangered Western Hoolock gibbons.",
    recommendation:
      "Visit at sunrise (05:30 to 07:00). Listen to the resounding territorial duets of Hoolock gibbon families echoing across the canopies.",
    best_season: "November to March",
    precautions:
      "Walk only with a licensed community naturalist. Leeches are common in damp months; wear gaiters or carry salt.",
    contributor_name: "Rupjyoti Saikia",
    status: "approved",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "urgelling-grove",
    name: "Urgelling Dalai Lama Birthplace Grove",
    state: "Arunachal Pradesh",
    latitude: 27.568,
    longitude: 91.88,
    photo_url:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    description:
      "A serene 15th-century Monpa monastery located south of Tawang, celebrated as the birthplace of Tsangyang Gyatso, the 6th Dalai Lama.",
    recommendation:
      "Sit beneath the sacred weeping willow tree planted in 1683. Far quieter and more intimate than the main Tawang citadel.",
    best_season: "April to October",
    precautions:
      "Inner Line Permit (ILP) required for Indian citizens; Protected Area Permit (PAP) for foreigners. Dress warmly as winds pick up quickly.",
    contributor_name: "Tenzin Norbu",
    status: "approved",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "karang-island",
    name: "Karang Floating Fisher Hamlet",
    state: "Manipur",
    latitude: 24.532,
    longitude: 93.815,
    photo_url:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
    description:
      "An island community in the heart of Loktak Lake surrounded by circular floating biomass islands (phumdis).",
    recommendation:
      "Hire a traditional wooden boat at Sendra. Eat locally caught smoked fish and fresh water chestnuts at sunset on a floating hut.",
    best_season: "October to March",
    precautions:
      "Avoid disturbing resting migratory birds; do not step onto thin phumdi edges without a local fisherman’s guidance.",
    contributor_name: "Chaoba Meitei",
    status: "approved",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

const LOCAL_STORAGE_KEY = "offbeat_ne_community_places_v1";

function getLocalPlaces() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(SEED_APPROVED_PLACES)
      );
      return SEED_APPROVED_PLACES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return SEED_APPROVED_PLACES;
  }
}

function saveLocalPlaces(places) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(places));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}

// Convert File to Base64 for local preview / storage fallback
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Fetch all approved places for public discovery
 */
export async function fetchApprovedPlaces() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("places")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) return data;
    } catch (err) {
      console.warn("Supabase fetch error, using local database fallback:", err);
    }
  }

  // Fallback to local persistent storage
  const all = getLocalPlaces();
  return all.filter((p) => p.status === "approved");
}

/**
 * Fetch all pending places for admin approval
 */
export async function fetchPendingPlaces() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("places")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn("Supabase pending fetch error:", err);
    }
  }

  const all = getLocalPlaces();
  return all.filter((p) => p.status === "pending");
}

/**
 * Submit a new hidden place. Status starts as 'pending'.
 */
export async function submitPlace(formData, photoFile) {
  let photoUrl = formData.photo_url || "";

  // 1. Try uploading to Supabase Storage if file and credentials exist
  if (photoFile && isSupabaseConfigured && supabase) {
    try {
      const fileExt = photoFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `places/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("place-photos")
        .upload(filePath, photoFile, { cacheControl: "3600", upsert: false });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("place-photos")
          .getPublicUrl(filePath);
        photoUrl = publicUrlData?.publicUrl || "";
      } else {
        console.warn("Supabase storage upload failed, converting to local image:", uploadError);
        photoUrl = await fileToBase64(photoFile);
      }
    } catch (e) {
      console.warn("Storage upload exception:", e);
      photoUrl = await fileToBase64(photoFile);
    }
  } else if (photoFile) {
    photoUrl = await fileToBase64(photoFile);
  }

  if (!photoUrl) {
    photoUrl =
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
  }

  const newPlace = {
    name: formData.name.trim(),
    state: formData.state,
    latitude: parseFloat(formData.latitude),
    longitude: parseFloat(formData.longitude),
    photo_url: photoUrl,
    description: formData.description.trim(),
    recommendation: formData.recommendation.trim(),
    best_season: formData.best_season.trim(),
    precautions: formData.precautions ? formData.precautions.trim() : "",
    contributor_name: formData.contributor_name.trim(),
    status: "pending", // ALWAYS pending until approved
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("places")
        .insert([newPlace])
        .select();

      if (error) throw error;
      return { success: true, data: data?.[0] || newPlace };
    } catch (err) {
      console.warn("Supabase insert error, saving to local database:", err);
    }
  }

  // Local storage fallback
  const localPlace = {
    ...newPlace,
    id: "place-" + Date.now().toString(36)
  };
  const places = getLocalPlaces();
  saveLocalPlaces([localPlace, ...places]);

  return { success: true, data: localPlace };
}

/**
 * Approve a pending place (Admin)
 */
export async function approvePlace(placeId) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("places")
        .update({ status: "approved" })
        .eq("id", placeId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.warn("Supabase approve error:", err);
    }
  }

  const places = getLocalPlaces();
  const updated = places.map((p) =>
    p.id === placeId ? { ...p, status: "approved" } : p
  );
  saveLocalPlaces(updated);
  return { success: true };
}

/**
 * Reject / Delete a place (Admin)
 */
export async function rejectPlace(placeId) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("places")
        .delete()
        .eq("id", placeId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.warn("Supabase delete error:", err);
    }
  }

  const places = getLocalPlaces();
  const updated = places.filter((p) => p.id !== placeId);
  saveLocalPlaces(updated);
  return { success: true };
}

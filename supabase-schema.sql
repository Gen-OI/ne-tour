-- =========================================================
-- Offbeat Northeast - Supabase Database & Storage Setup
-- =========================================================

-- 1. Create Places Table
create table if not exists public.places (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  state text not null,
  latitude double precision not null,
  longitude double precision not null,
  photo_url text,
  description text not null,
  recommendation text not null,
  best_season text not null,
  precautions text,
  contributor_name text not null,
  status text default 'pending' not null check (status in ('pending', 'approved', 'rejected'))
);

-- 2. Enable Row Level Security (RLS)
alter table public.places enable row level security;

-- 3. RLS Policies

-- Public can view ONLY approved places
create policy "Allow public to view approved places"
  on public.places
  for select
  using (status = 'approved');

-- Anyone can submit a place, but status must be 'pending'
create policy "Allow public to insert pending places"
  on public.places
  for insert
  with check (status = 'pending');

-- Service role / Admin policy to view all submissions
create policy "Allow full access for service role or admin"
  on public.places
  for all
  using (true)
  with check (true);

-- 4. Create Storage Bucket for Place Photographs
insert into storage.buckets (id, name, public)
values ('place-photos', 'place-photos', true)
on conflict (id) do nothing;

-- Storage Policies for place-photos bucket
create policy "Public Access to Place Photographs"
  on storage.objects for select
  using (bucket_id = 'place-photos');

create policy "Public Upload of Place Photographs"
  on storage.objects for insert
  with check (bucket_id = 'place-photos');

-- 5. Seed Initial Approved Places
insert into public.places (
  name, state, latitude, longitude, photo_url, description, recommendation, best_season, precautions, contributor_name, status
) values
(
  'Khonoma Terraced Alder Sanctuary',
  'Nagaland',
  25.6510,
  94.0205,
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
  'India’s first green village, nestled amid ancient terraced hills and conserved community forests where logging and hunting are banned.',
  'Walk early into the alder forests where farmers practice 200-year-old sustainable agroforestry. Visit the village fort (Semoma) at twilight.',
  'October to April',
  'Obtain ILP (Inner Line Permit) before entering Nagaland; respect village sanctuary rules regarding plastic waste and noise.',
  'Kevisato Angami',
  'approved'
),
(
  'Dzukou Valley North Ridge',
  'Nagaland',
  25.5528,
  94.0754,
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'A high-altitude basin of rolling dwarf bamboo dunes, cold meandering streams, and rare endemic flora tucked at 2,450 meters.',
  'Bypass the crowded visitor resthouse and camp near the natural caves on the north ridge to see the morning mist roll over the bamboo crests.',
  'June to September (for seasonal lilies) or November for winter frost',
  'Steep 4-hour hike with no paved road. Trek with warm layers, waterproof gear, and a registered local Angami guide.',
  'Thepfuvilie',
  'approved'
),
(
  'Mawryngkhang Bamboo Cliff Trail',
  'Meghalaya',
  25.2950,
  91.8550,
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  'A series of traditional bamboo skywalks constructed by Wahkhen villagers, clinging to towering granite gorges above wild river ravines.',
  'Cross the legendary King Rock (U Mawryngkhang). The craftsmanship of local Khasi bamboo artisans holding this trail together is astonishing.',
  'November to February',
  'Not recommended for those with vertigo or during heavy monsoon downpours. Sturdy shoes with grip are essential.',
  'Bantei Khongwir',
  'approved'
),
(
  'Nongriat Rainbow River Pools',
  'Meghalaya',
  25.2505,
  91.6720,
  'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
  'Natural crystalline turquoise swimming basins situated past the ancient double-decker living root bridges deep in the Umshiang river canyon.',
  'Bathe in the crystal mineral waters under towering Ficus elastica canopies. Homestays run by Khasi families serve fresh wild bay leaf tea.',
  'October to April',
  'Requires climbing over 3,000 stone steps down and up. Pack light and carry reusable water bottles to avoid plastic litter in the canyon.',
  'Daphisha Syiem',
  'approved'
),
(
  'Chamaguri Satra Mask Artisan Cloister',
  'Assam',
  26.9620,
  94.2850,
  'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
  'A centuries-old monastery on Majuli Island where master artisans preserve traditional Neo-Vaishnavite bamboo, clay, and cloth mask craftsmanship.',
  'Sit with the Goswami family in their open courtyard studio while they weave pliable bamboo skeletons for traditional Bhaona performances.',
  'October to March',
  'Majuli is reached by river ferry from Nimati Ghat (Jorhat). Be respectful of monastery prayer hours and footwear customs.',
  'Pradip Goswami',
  'approved'
),
(
  'Panbari Wildlife Canopy Corridor',
  'Assam',
  26.6210,
  93.2840,
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
  'A dense semi-evergreen canopy corridor adjacent to the Kaziranga hills, known for canopy birds and endangered Western Hoolock gibbons.',
  'Visit at sunrise (05:30 to 07:00). Listen to the resounding territorial duets of Hoolock gibbon families echoing across the canopies.',
  'November to March',
  'Walk only with a licensed community naturalist. Leeches are common in damp months; wear gaiters or carry salt.',
  'Rupjyoti Saikia',
  'approved'
),
(
  'Urgelling Dalai Lama Birthplace Grove',
  'Arunachal Pradesh',
  27.5680,
  91.8800,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'A serene 15th-century Monpa monastery located south of Tawang, celebrated as the birthplace of Tsangyang Gyatso, the 6th Dalai Lama.',
  'Sit beneath the sacred weeping willow tree planted in 1683. Far quieter and more intimate than the main Tawang citadel.',
  'April to October',
  'Inner Line Permit (ILP) required for Indian citizens; Protected Area Permit (PAP) for foreigners. Dress warmly as winds pick up quickly.',
  'Tenzin Norbu',
  'approved'
),
(
  'Karang Floating Fisher Hamlet',
  'Manipur',
  24.5320,
  93.8150,
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
  'An island community in the heart of Loktak Lake surrounded by circular floating biomass islands (phumdis).',
  'Hire a traditional non-motorized wooden boat at Sendra. Eat locally caught smoked fish and fresh water chestnuts at sunset.',
  'October to March',
  'Avoid disturbing resting migratory birds; do not step onto thin phumdi edges without a local fisherman’s guidance.',
  'Chaoba Meitei',
  'approved'
);

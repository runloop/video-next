-- SEO override backfill for public.projects (seo_title, seo_slug, seo_description, seo_blurb).
--
-- Per-video SEO copy for every catalogue/stream project across both channels. Each
-- title is reshaped around the SHORT searched keywords (head terms "Cat TV" / "Dog TV"
-- plus the matching subject + scene), keeping the video's specific hook and VARYING the
-- title structure across videos (subject-led / hook-led / brand-led / season-led /
-- scene-led) so the catalogue never reads as templated doorway copy. Slugs are
-- keyword-favourable (not a slugify of the descriptive sentence) and globally unique.
-- One UPDATE per project, keyed on public.projects.id (= the streams/published-videos
-- project_id). Grounded in each project's real public YouTube title + tags and in
-- docs/search-queries/cattv.csv & dogtv.csv.
--
--   * seo_title       reshaped, <= 60 chars, used VERBATIM for <h1> and <title>/OG.
--   * seo_slug        <= 60 chars, lowercase-hyphenated, globally unique across ALL rows.
--   * seo_description  first sentence <= 150 chars (becomes the meta description),
--                      then 1-2 sentences of below-the-fold copy.
--   * seo_blurb        <= 90 chars, the card subtitle.
--
-- Domain rules honoured: CAT = UK garden birds & squirrels, hunting-instinct framing,
-- never "calm", never "fish". DOG = calming virtual walks, no place names (the 2 Finnish
-- titles stay truthful), no "no music" claims (music varies; that note is per-item,
-- rendered app-side). Universal: never "live"/"cam"/"continuous".
--
-- Read-only output: this script is hand-reviewable SQL and writes nothing on its own.
-- Apply with a role that can write. The four columns + the partial unique index on
-- seo_slug already exist live; the DDL below is kept (commented) only to document shape:
--
--   ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS seo_title       text;
--   ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS seo_slug        text;
--   ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS seo_description text;
--   ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS seo_blurb       text;
--   CREATE UNIQUE INDEX IF NOT EXISTS projects_seo_slug_key
--     ON public.projects (seo_slug) WHERE seo_slug IS NOT NULL;

BEGIN;

-- =====================================================================
-- CAT - Patsy's Garden (patsysgarden) - 129 projects
-- =====================================================================

UPDATE public.projects SET
  seo_title       = $$Winter Squirrels & Birds in the Frost — Cat TV$$,
  seo_slug        = $$cat-tv-winter-squirrels-birds-frost$$,
  seo_description = $$Cat TV for an indoor cat: greedy grey squirrels scrabble across a frost-rimed garden stool, cheeks bulging with stolen nuts as robins dart past. Cold-weather footage to set an indoor cat stalking and chattering. Streams day and night.$$,
  seo_blurb       = $$Frosty stool, nut-stuffing squirrels and darting robins to stalk$$
WHERE id = $$003-c-hdr-stool$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels & Birds Take Over the Garden Wall — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-birds-take-over-garden$$,
  seo_description = $$On the old garden wall, squirrels barge in to raid the seed while blue tits flit between the bricks — twitchy prey for a watching cat. Real footage of quick, twitchy movement that pulls a bored cat into a crouch.$$,
  seo_blurb       = $$Wall raiders and flitting tits to track and pounce on$$
WHERE id = $$006-c-hdr-the-wall$$;
UPDATE public.projects SET
  seo_title       = $$Cat TV: Squirrels & Birds at the Garden$$,
  seo_slug        = $$cat-tv-squirrels-birds-garden$$,
  seo_description = $$For a watching cat, acrobatic squirrels leap among early crocuses, tails flicking, as blackbirds peck at the seed nearby. Bright, busy garden action made to switch on a house cat's hunting drive.$$,
  seo_blurb       = $$Crocus-time squirrels leaping past pecking blackbirds$$
WHERE id = $$007-c-hdr-crocuses$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels & Birds on the Garden Fountain — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-birds-garden-fountain$$,
  seo_description = $$For a bored indoor cat, a bold squirrel balances on the fountain rim, nicking nuts while coal tits zip in for a grab. Fast, darting motion to keep an indoor cat tracking and twitching.$$,
  seo_blurb       = $$Fountain-edge squirrel and zipping coal tits to chase$$
WHERE id = $$009-c-hdr-fountain$$;
UPDATE public.projects SET
  seo_title       = $$Garden Tree Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-garden-tree-squirrels-birds$$,
  seo_description = $$Squirrels spiral up and down the garden tree, woodpigeons clattering through the branches — restless prey for a cat to track. Endless climbing and chasing to fire a cat's pounce instinct.$$,
  seo_blurb       = $$Tree-climbing squirrels and clattering woodpigeons$$
WHERE id = $$010-c-hdr-tree$$;
UPDATE public.projects SET
  seo_title       = $$Birds & Squirrels on the Garden Wall — Cat TV$$,
  seo_slug        = $$cat-tv-birds-squirrels-garden-wall$$,
  seo_description = $$Robins and great tits dart along the garden wall while a squirrel muscles in to claim the nuts, easy prey for a watching cat. Plenty of sudden movement to set an indoor cat crouching and ready to spring.$$,
  seo_blurb       = $$Birds darting the wall as a squirrel barges the nuts$$
WHERE id = $$011-c-hdr-wall$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels & Birds Take Over the Garden Stool — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-birds-take-over-garden-stool$$,
  seo_description = $$Squirrels commandeer the garden stool, cramming their cheeks while birds wait their turn — cheeky raids for a bored cat to track. Quick, restless movement that keeps an indoor cat fixed on every leap.$$,
  seo_blurb       = $$Stool-stealing squirrels with birds biding their time$$
WHERE id = $$012-c-hdr-stool$$;
UPDATE public.projects SET
  seo_title       = $$Cat TV: Squirrels & Birds at the Garden Lawn$$,
  seo_slug        = $$cat-tv-squirrels-birds-garden-lawn$$,
  seo_description = $$Around the old wheelbarrow, squirrels scamper and snatch nuts as jackdaws strut behind, real prey movement for a house cat to stalk. Grassy, restless action to draw a house cat into the hunt.$$,
  seo_blurb       = $$Wheelbarrow squirrels and strutting jackdaws on the lawn$$
WHERE id = $$013-c-hdr-wheelbarrow$$;
UPDATE public.projects SET
  seo_title       = $$Spring Squirrels & Birds on the Garden — Cat TV$$,
  seo_slug        = $$cat-tv-spring-squirrels-birds-garden$$,
  seo_description = $$Spring squirrels bound between hyacinths, raiding nuts while blue tits flit through the blooms — fresh prey for an indoor cat to stalk. Fresh-season movement to keep a cat chattering at the glass.$$,
  seo_blurb       = $$Spring squirrels raiding nuts among the hyacinths$$
WHERE id = $$014-c-hdr-hyacinths$$;
UPDATE public.projects SET
  seo_title       = $$Garden Fountain Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-garden-fountain-squirrels-birds$$,
  seo_description = $$A squirrel perches by the fountain, paws full of stolen seed, as magpies swoop to challenge it — squabbling motion for a watchful cat. Real garden footage of darting, squabbling motion to engage a watchful cat.$$,
  seo_blurb       = $$Fountain squirrel and swooping magpies squabbling for seed$$
WHERE id = $$015-c-hdr-bottles$$;
UPDATE public.projects SET
  seo_title       = $$Birds & Squirrels on the Garden — Cat TV$$,
  seo_slug        = $$cat-tv-birds-squirrels-garden$$,
  seo_description = $$For a bored indoor cat, here come the squirrels — leaping, cheek-stuffing, tails twitching. Robins and crows dart through the garden between them, all quick movement to track.$$,
  seo_blurb       = $$Leaping squirrels and darting birds across the garden$$
WHERE id = $$017-c-hdr-danwood$$;
UPDATE public.projects SET
  seo_title       = $$Spring Squirrels & Birds Take Over the Garden Stool — Cat TV$$,
  seo_slug        = $$cat-tv-spring-squirrels-birds-take-over$$,
  seo_description = $$Spring brings squirrels swarming the garden stool, cramming nuts as great tits dart around them, lively prey for a house cat. Lively warm-weather action to set a house cat crouching and tracking.$$,
  seo_blurb       = $$Spring stool squirrels and darting great tits$$
WHERE id = $$019-c-hdr-stool$$;
UPDATE public.projects SET
  seo_title       = $$Cat TV: Squirrels & Birds at the Bird Table$$,
  seo_slug        = $$cat-tv-squirrels-birds-bird-table$$,
  seo_description = $$Watch a cat lock on: squirrels clamber onto the bird table to plunder the seed while blackbirds and coal tits dart in and out. Busy, twitchy movement to fire an indoor cat's hunting instinct.$$,
  seo_blurb       = $$Bird-table squirrels plundering seed as birds dart in$$
WHERE id = $$020-c-hdr-birdtable$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels & Birds on the Garden Wall — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-birds-garden-wall$$,
  seo_description = $$Squirrels scramble over the rocks along the garden wall, nuts in their cheeks, as jackdaws drop in — restless prey for a stalking cat. Restless action to keep a watchful cat stalking.$$,
  seo_blurb       = $$Rock-scrambling squirrels and scavenging jackdaws$$
WHERE id = $$022-c-hdr-rocks$$;
UPDATE public.projects SET
  seo_title       = $$Peaceful Garden Fountain Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-peaceful-garden-fountain-squirrels-birds$$,
  seo_description = $$By the fountain a lone squirrel raids the nuts as robins flit in to feed, small sudden movements for an indoor cat to track. Robins flit in to feed, small sudden movements to keep an indoor cat tracking and ready.$$,
  seo_blurb       = $$Quiet fountain garden with a squirrel and flitting robins$$
WHERE id = $$026-c-hdr-fountain$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels & Birds Picnic on the Wall — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-birds-picnic-wall$$,
  seo_description = $$Squirrels picnic along the garden wall, cheeks crammed with nuts, while woodpigeons and blue tits jostle below — darting prey for a cat to chase. Plenty of movement to set a cat pouncing.$$,
  seo_blurb       = $$Wall-top squirrel picnic with jostling birds to chase$$
WHERE id = $$027-c-hdr-wall-picnic$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels & Birds Take Over the Bird Table — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-birds-take-over-bird$$,
  seo_description = $$Starlings swarm the bird table in a noisy flurry as a squirrel shoves through to grab the nuts, whirling prey for a bored cat. Whirling, restless action to switch on a bored cat's stalking drive.$$,
  seo_blurb       = $$Starling-swarmed bird table with a nut-grabbing squirrel$$
WHERE id = $$028-c-hdr-starlings-birdtable$$;
UPDATE public.projects SET
  seo_title       = $$Summer Cat TV: Squirrels & Birds at the Bird Table$$,
  seo_slug        = $$cat-tv-summer-squirrels-birds-bird-table$$,
  seo_description = $$Cat TV for a restless house cat: summer squirrels race between the bird table and the leafy tree, raiding nuts as great tits dart by. Quick motion to keep an indoor cat tracking.$$,
  seo_blurb       = $$Summer squirrels racing tree to table past darting tits$$
WHERE id = $$029-c-hdr-birdtable-tree$$;
UPDATE public.projects SET
  seo_title       = $$Peaceful Squirrels & Birds on the Garden Wall — Cat TV$$,
  seo_slug        = $$cat-tv-peaceful-squirrels-birds-garden-wall$$,
  seo_description = $$A squirrel scrabbles the brick garden wall for nuts while coal tits flit through the gaps, twitchy prey for a watching cat. Coal tits flit between the gaps in quiet but twitchy movement to keep a cat watching and ready.$$,
  seo_blurb       = $$Quiet brick wall with a scrabbling squirrel and coal tits$$
WHERE id = $$030-c-hdr-wall-bricks$$;
UPDATE public.projects SET
  seo_title       = $$Garden Feeders Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-garden-feeders-squirrels-birds$$,
  seo_description = $$A robin holds its ground at the feeders while squirrels muscle past for scattered nuts. Real garden footage to set an indoor cat stalking and chattering. Streams day and night.$$,
  seo_blurb       = $$Robin guards the feeders as squirrels barge in for the nuts$$
WHERE id = $$031-c-hdr-bird-feeders$$;
UPDATE public.projects SET
  seo_title       = $$Birds & Squirrels on the Garden Rocks — Cat TV$$,
  seo_slug        = $$cat-tv-birds-squirrels-garden-rocks$$,
  seo_description = $$Blue tits flit between the garden rocks while a grey squirrel forages the seed below — quick prey for a bored cat. Plenty of quick, darting movement to fix a bored cat's gaze and twitch its tail.$$,
  seo_blurb       = $$Blue tits dart over the rocks, squirrels rummaging the seed$$
WHERE id = $$034-c-hdr-chickens$$;
UPDATE public.projects SET
  seo_title       = $$Lively Squirrels & Birds Take Over the Garden Stool — Cat TV$$,
  seo_slug        = $$cat-tv-lively-squirrels-birds-take-over$$,
  seo_description = $$A magpie barges onto the garden stool, scattering blackbirds before a squirrel claims the perch — busy traffic for a cat to track. Endless comings and goings to keep an indoor cat tracking and pouncing.$$,
  seo_blurb       = $$Magpie storms the stool, squirrels and birds scrambling$$
WHERE id = $$035-c-hdr-stools$$;
UPDATE public.projects SET
  seo_title       = $$Cat TV: Squirrels & Birds at the Garden Stool$$,
  seo_slug        = $$cat-tv-squirrels-birds-garden-stool$$,
  seo_description = $$Coal tits hop from rock to stool, snatching seed between a squirrel's raids — flickering prey for a restless cat. Sharp, flickering motion gives a restless cat something to lock onto and chase.$$,
  seo_blurb       = $$Coal tits and squirrels work the rock and stool$$
WHERE id = $$036-c-hdr-rock-stool$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels & Birds on the Garden Lawn — Cat TV$$,
  seo_slug        = $$squirrels-birds-garden-lawn-cat-tv$$,
  seo_description = $$Give a windowsill cat a hunt: woodpigeons lumber across the lawn as squirrels dash for buried nuts. Wide-open grass and constant low movement keep a watchful cat stalking from the windowsill.$$,
  seo_blurb       = $$Woodpigeons lumber the lawn while squirrels dig for nuts$$
WHERE id = $$039-c-hdr-log-pile$$;
UPDATE public.projects SET
  seo_title       = $$Patio Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-patio-squirrels-birds$$,
  seo_description = $$On the sunlit patio, jackdaws squabble over a feeder while a squirrel hangs upside down at the seed. Quick chaos for an indoor cat to track and chatter at.$$,
  seo_blurb       = $$Jackdaws squabble the patio feeders, squirrels hanging on$$
WHERE id = $$042-c-hdr-feeders$$;
UPDATE public.projects SET
  seo_title       = $$Birds & Squirrels on the Garden Fountain — Cat TV$$,
  seo_slug        = $$cat-tv-birds-squirrels-garden-fountain$$,
  seo_description = $$A blackbird splashes at the garden fountain while squirrels dart in for nuts, a moving target for a watching cat. The flit and ripple give a bored cat something to stalk and pounce on.$$,
  seo_blurb       = $$Blackbird at the fountain, squirrels darting for nuts$$
WHERE id = $$043-c-hdr-fountain$$;
UPDATE public.projects SET
  seo_title       = $$Busy Squirrels & Birds Take Over the Garden Stool — Cat TV$$,
  seo_slug        = $$cat-tv-busy-squirrels-birds-take-over$$,
  seo_description = $$Cat TV for an indoor cat: great tits flit through the branches above the garden stool as squirrels scrap for seed below. Layers of busy movement to fix a watchful indoor cat's stare.$$,
  seo_blurb       = $$Great tits in the branches, squirrels busy at the stool$$
WHERE id = $$046-c-hdr-stool-branches$$;
UPDATE public.projects SET
  seo_title       = $$Peaceful Cat TV: Squirrels & Birds at the Bird Table$$,
  seo_slug        = $$cat-tv-peaceful-squirrels-birds-bird-table$$,
  seo_description = $$Robins and coal tits work a quiet bird table for a watching cat, picking seed between a squirrel's careful visits. A calmer garden, but still real prey movement for a cat to track and stalk.$$,
  seo_blurb       = $$A quieter bird table, robins and a wary squirrel feeding$$
WHERE id = $$047-c-hdr-birdhouse$$;
UPDATE public.projects SET
  seo_title       = $$Lively Squirrels & Birds on the Garden Wall — Cat TV$$,
  seo_slug        = $$cat-tv-lively-squirrels-birds-garden-wall$$,
  seo_description = $$For a bored indoor cat, squirrels scale the garden wall while a magpie struts the bricks below, chasing off smaller birds. Fast scrambling up and over to keep an indoor cat pouncing.$$,
  seo_blurb       = $$Squirrels scale the wall, a magpie strutting the bricks$$
WHERE id = $$048-c-hdr-wall-brick-stack$$;
UPDATE public.projects SET
  seo_title       = $$Lively Garden Fountain Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-lively-garden-fountain-squirrels-birds$$,
  seo_description = $$A crow muscles in at the lively fountain, scattering blue tits as squirrels lap at the water's edge — quick action for a cat to follow. Splashing and darting to keep a bored cat locked on and twitching.$$,
  seo_blurb       = $$Crow crashes the fountain, blue tits and squirrels scatter$$
WHERE id = $$049-c-hdr-bottles$$;
UPDATE public.projects SET
  seo_title       = $$Birds & Squirrels on the Garden Stool — Cat TV$$,
  seo_slug        = $$cat-tv-birds-squirrels-garden-stool$$,
  seo_description = $$Jackdaws and woodpigeons crowd the garden stool for a cat to watch, jostling a squirrel off the seed. Steady jostling traffic gives an indoor cat plenty to track and chatter at.$$,
  seo_blurb       = $$Jackdaws crowd the stool, squirrels jostled off the seed$$
WHERE id = $$050-c-hdr-stools-wood$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels & Birds Take Over the Garden — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-birds-take-over$$,
  seo_description = $$Squirrels take over the whole garden, raiding the seed bowls as great tits and robins dart in — easy prey for a stalking cat. Nonstop scurrying to set a restless cat stalking.$$,
  seo_blurb       = $$Squirrels overrun the garden, birds darting the seed bowls$$
WHERE id = $$052-c-hdr-leg-bowls$$;
UPDATE public.projects SET
  seo_title       = $$Cat TV: Squirrels & Birds at the Garden Feeders$$,
  seo_slug        = $$cat-tv-squirrels-birds-garden-feeders$$,
  seo_description = $$Cat TV for an indoor hunter: blue tits and great tits swing on the garden feeders while a squirrel clings below for nuts. Quick, flickering motion gives an indoor cat a prey to fix on and pounce.$$,
  seo_blurb       = $$Tits swing the feeders, a squirrel clinging for the nuts$$
WHERE id = $$053-c-hdr-feeders$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels & Birds on the Bird Table — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-birds-bird$$,
  seo_description = $$A woodpigeon hogs the bird table until a squirrel bounds up and clears it, prey enough for any cat. Crowded, shifting movement keeps a bored cat tracking and chattering at the glass.$$,
  seo_blurb       = $$Woodpigeon hogs the bird table till a squirrel bounds up$$
WHERE id = $$054-c-hdr-birdtables$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels in the Pumpkin Patch — Halloween Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-pumpkin-patch-halloween$$,
  seo_description = $$Squirrels scramble over carved pumpkins for a cat to stalk, with birds darting between the gourds. A spooky-season garden full of quick movement for a cat to stalk and pounce.$$,
  seo_blurb       = $$Squirrels clamber the Halloween pumpkins on the log pile$$
WHERE id = $$055-c-hdr-halloween-logs$$;
UPDATE public.projects SET
  seo_title       = $$Peaceful Squirrels in the Pumpkin Patch — Halloween Cat TV$$,
  seo_slug        = $$cat-tv-peaceful-squirrels-pumpkin-patch-halloween$$,
  seo_description = $$Among the pumpkins on the stools, a robin picks seed while squirrels forage — quiet prey for an indoor cat. A calmer Halloween garden, still alive with prey for a cat to track.$$,
  seo_blurb       = $$A quieter pumpkin patch, robin and squirrels among the gourds$$
WHERE id = $$056-c-hdr-halloween-stools$$;
UPDATE public.projects SET
  seo_title       = $$Lively Squirrels in the Pumpkin Patch — Halloween Cat TV$$,
  seo_slug        = $$cat-tv-lively-squirrels-pumpkin-patch-halloween$$,
  seo_description = $$Squirrels go wild in the pumpkin patch, scrambling over carved gourds as birds scatter — lively prey for an indoor cat. A spooky-season garden to keep a cat pouncing at the window.$$,
  seo_blurb       = $$Squirrels run riot through the Halloween pumpkin patch$$
WHERE id = $$057-c-hdr-halloween-squirrel-pumpkins$$;
UPDATE public.projects SET
  seo_title       = $$Halloween Squirrels Among the Skulls — Cat TV$$,
  seo_slug        = $$cat-tv-halloween-squirrels-among-skulls$$,
  seo_description = $$A magpie picks among the skulls and pumpkins for a watching cat as squirrels dart for nuts. Eerie Halloween décor and constant movement to set a cat stalking.$$,
  seo_blurb       = $$Magpie among the Halloween skulls, squirrels at the fountain$$
WHERE id = $$058-c-hdr-halloween-fountain$$;
UPDATE public.projects SET
  seo_title       = $$Autumn Squirrels & Birds on the Garden — Cat TV$$,
  seo_slug        = $$cat-tv-autumn-squirrels-birds-garden$$,
  seo_description = $$Give a window-bound cat a target: squirrels raid the berry-laden autumn feeders while birds dart for scattered nuts. Russet leaves drift past as tails flick and beaks jab. Real garden footage, on whenever your cat needs a hunt.$$,
  seo_blurb       = $$Autumn feeders to stalk: squirrels, birds, twitching tails$$
WHERE id = $$059-c-hdr-berry-feeders$$;
UPDATE public.projects SET
  seo_title       = $$Garden Stool Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-garden-stool-squirrels-birds$$,
  seo_description = $$A bored indoor cat gets a whole crew to track when squirrels overrun the garden stool, scattering seed as woodpigeons shove in. Quick darting moves keep an idle hunter chattering at the glass.$$,
  seo_blurb       = $$Squirrels claim the stool — a busy hunt for your cat$$
WHERE id = $$060-c-hdr-squirrel-takeover$$;
UPDATE public.projects SET
  seo_title       = $$Christmas Squirrels & Birds — Cat TV$$,
  seo_slug        = $$cat-tv-christmas-squirrels-birds$$,
  seo_description = $$Festive houses line the garden wall and squirrels scramble between them for your cat to chase, coal tits snatching nuts. Plenty of sudden movement for your cat to lock onto and pounce at. Christmas footage, streaming day and night.$$,
  seo_blurb       = $$Christmas wall houses, squirrels darting for your cat to chase$$
WHERE id = $$061-c-hdr-xmas-wall-houses$$;
UPDATE public.projects SET
  seo_title       = $$Cat TV: Christmas Squirrels & Birds$$,
  seo_slug        = $$cat-tv-christmas-squirrels$$,
  seo_description = $$For a restless indoor cat, decked-out Christmas bird tables draw robins and blackbirds while squirrels muscle in for seed. It's a darting, flapping target to stalk all season long.$$,
  seo_blurb       = $$Festive bird tables, flapping wings for an indoor hunter$$
WHERE id = $$062-c-hdr-xmas-birdtables$$;
UPDATE public.projects SET
  seo_title       = $$Christmas Garden Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-christmas-garden-squirrels-birds$$,
  seo_description = $$Twinkling lights blur behind the feeders, a treat for a bored cat, as a grey squirrel raids the nuts and great tits flit past. Soft bokeh, sharp movement — exactly what a bored cat wants to track and chatter at.$$,
  seo_blurb       = $$Christmas bokeh and a raiding squirrel to track$$
WHERE id = $$063-c-hdr-xmas-squirrel-bokeh$$;
UPDATE public.projects SET
  seo_title       = $$Festive Squirrels & Birds — Christmas Cat TV$$,
  seo_slug        = $$cat-tv-festive-squirrels-birds-christmas$$,
  seo_description = $$Cheeky elves and candles set the scene for your indoor cat as squirrels dash through and jackdaws drop in for seed. Give your indoor cat something festive to fixate on and pounce toward. Real footage, always on.$$,
  seo_blurb       = $$Festive elves, candles and squirrels to pounce at$$
WHERE id = $$065.1-c-hdr-xmas-elves-candles$$;
UPDATE public.projects SET
  seo_title       = $$Peaceful Christmas Squirrels & Birds — Cat TV$$,
  seo_slug        = $$cat-tv-peaceful-christmas-squirrels-birds$$,
  seo_description = $$A quieter Christmas garden, but never still for a watching cat: a squirrel slips past the candlelit elves and a robin works the nuts. Just enough flick and dart to keep your cat's hunting eye busy.$$,
  seo_blurb       = $$Quieter festive garden, a robin and squirrel to watch$$
WHERE id = $$065.2-c-hdr-xmas-elves-candles$$;
UPDATE public.projects SET
  seo_title       = $$Peaceful Cat TV: Christmas Squirrels & Birds$$,
  seo_slug        = $$cat-tv-peaceful-christmas-squirrels$$,
  seo_description = $$On the candlelit windowsill, elves stand guard while blue tits flit in for a watching cat and a squirrel noses the seed. A calmer Christmas garden that still gives a watching cat plenty to stalk.$$,
  seo_blurb       = $$Candlelit elves, blue tits flitting for your cat to stalk$$
WHERE id = $$065.3-c-hdr-xmas-elves-candles$$;
UPDATE public.projects SET
  seo_title       = $$Christmas Garden Stool Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-christmas-garden-stool-squirrels-birds$$,
  seo_description = $$More festive elves crowd the garden stool, squirrels vaulting across for a cat to chase and birds snatching nuts. Sudden scrambles and flapping wings give an idle cat a moving target to chase.$$,
  seo_blurb       = $$Christmas stool chaos: elves, squirrels, birds to chase$$
WHERE id = $$066-c-hdr-xmas-elves-pt2$$;
UPDATE public.projects SET
  seo_title       = $$Misty Festive Squirrels & Birds — Christmas Cat TV$$,
  seo_slug        = $$cat-tv-misty-festive-squirrels-birds-christmas$$,
  seo_description = $$Through soft Christmas mist, squirrels emerge to claim the nuts as a watching cat fixes on them and magpies bicker over seed. The hazy frame and quick darting shapes pull a bored cat straight to the glass to track them.$$,
  seo_blurb       = $$Misty festive garden, squirrels surfacing to be tracked$$
WHERE id = $$067-c-hdr-xmas-frame$$;
UPDATE public.projects SET
  seo_title       = $$Morning Christmas Squirrels & Birds — Cat TV$$,
  seo_slug        = $$cat-tv-morning-christmas-squirrels-birds$$,
  seo_description = $$Cat TV for an indoor cat: morning light hits the tree and wrapped presents as squirrels bound past and robins work the feeders. For a cat waking restless, here's an early hunt of flitting birds to lock onto.$$,
  seo_blurb       = $$Christmas morning birds and squirrels for an early hunt$$
WHERE id = $$069-c-hdr-xmas-tree-presents$$;
UPDATE public.projects SET
  seo_title       = $$New Year Squirrels & Birds — Cat TV$$,
  seo_slug        = $$cat-tv-new-year-squirrels-birds$$,
  seo_description = $$Ring in the year with a garden a cat can't ignore: squirrels barge the feeders and crows wheel down for seed. A fresh start of darting, pouncing-target action for your indoor cat.$$,
  seo_blurb       = $$New Year garden, crows and squirrels to pounce on$$
WHERE id = $$070-c-hdr-new-year-2024$$;
UPDATE public.projects SET
  seo_title       = $$Birds & Squirrels on the Bird Table — Cat TV$$,
  seo_slug        = $$cat-tv-birds-squirrels-bird-table$$,
  seo_description = $$Robins, blackbirds and a bossy woodpigeon trade places on the bird table while a squirrel raids below — prime stalking for a window cat. Endless quick movement gives a window-watching cat someone to chatter and lunge at.$$,
  seo_blurb       = $$Bird-table comings and goings to chatter at$$
WHERE id = $$071-c-hdr-birdtable$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels & Birds Take Over the Garden Fountain — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-birds-take-over-garden-fountain$$,
  seo_description = $$For a bored indoor cat, squirrels and birds take over the garden fountain and stools, hopping the rim and snatching nuts. Trickling water and sudden darts make a perfect stalking puzzle.$$,
  seo_blurb       = $$Fountain and stools overrun — a stalking puzzle for cats$$
WHERE id = $$072-c-hdr-fountain-stools$$;
UPDATE public.projects SET
  seo_title       = $$Frosty Winter Squirrels & Birds in the Frost — Cat TV$$,
  seo_slug        = $$cat-tv-frosty-winter-squirrels-birds-frost$$,
  seo_description = $$On the frosted stools, breath-fogging cold doesn't stop the squirrels working the nuts while great tits flit in for a cat to track. Crisp winter movement keeps your cat tracking and twitching at the window.$$,
  seo_blurb       = $$Frosty stools, squirrels and tits darting in the cold$$
WHERE id = $$073-c-hdr-frosty-stools$$;
UPDATE public.projects SET
  seo_title       = $$Busy Squirrels & Birds on the Garden Wall — Cat TV$$,
  seo_slug        = $$cat-tv-busy-squirrels-birds-garden-wall$$,
  seo_description = $$A magpie chases a squirrel down the garden wall as blackbirds dart between the stones — pure prey movement for a cat. Busy, fast and unpredictable, just the moving target a restless indoor cat wants to pounce on.$$,
  seo_blurb       = $$Busy garden wall, a magpie-and-squirrel chase to pounce on$$
WHERE id = $$074-c-hdr-down-the-wall$$;
UPDATE public.projects SET
  seo_title       = $$Bird Table Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-bird-table-squirrels-birds$$,
  seo_description = $$For a cat stuck indoors, the bird tables are a buffet of motion: coal tits, robins and squirrels jostling over seed and nuts. Quick flits and scrambles to stalk, track and chatter at.$$,
  seo_blurb       = $$Bird tables abuzz with flits and scrambles to stalk$$
WHERE id = $$079-c-hdr-birdtables$$;
UPDATE public.projects SET
  seo_title       = $$Peaceful Birds & Squirrels on the Garden Wall — Cat TV$$,
  seo_slug        = $$cat-tv-peaceful-birds-squirrels-garden-wall$$,
  seo_description = $$The wall, rocks and pots stay quieter today, but a squirrel still picks through the nuts and a robin hops the stones for a cat to spot. Subtle, sudden movement keeps a watching cat's hunting eye sharp.$$,
  seo_blurb       = $$Quieter wall and pots, a squirrel still there to track$$
WHERE id = $$080-c-hdr-wall-rocks-pots$$;
UPDATE public.projects SET
  seo_title       = $$Quiet Squirrels & Birds Take Over the Garden Stool — Cat TV$$,
  seo_slug        = $$cat-tv-quiet-squirrels-birds-take-over$$,
  seo_description = $$Squirrel on the garden stool, vaulting to the log pile while blue tits dart for seed — a cat's eye won't rest. Even on a quieter day there's plenty of flick and scurry for an indoor cat to stalk and pounce at.$$,
  seo_blurb       = $$Squirrel owns the stool and logs — a quiet-day hunt$$
WHERE id = $$081.1-c-hdr-stools-logs$$;
UPDATE public.projects SET
  seo_title       = $$Cat TV: Squirrels & Birds at the Garden Fountain$$,
  seo_slug        = $$squirrels-birds-garden-fountain-cat-tv$$,
  seo_description = $$Grey squirrels and woodpigeons squabble over seed as the stone fountain drips into a shallow puddle — real prey for a cat to stalk. Garden footage to set an indoor cat tracking and twitching at every dart. Streams day and night.$$,
  seo_blurb       = $$Stone fountain, a puddle, and squirrels worth pouncing on$$
WHERE id = $$084-c-hdr-fountain-puddle$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels & Birds on the Garden — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-birds$$,
  seo_description = $$Rain freckles the old wooden garden stools as robins and a brazen squirrel dash in for nuts, easy prey for a watching cat. Quick, flitting movement gives a bored housecat something to chatter at and chase with its eyes.$$,
  seo_blurb       = $$Rain-dotted stools and birds darting in for nuts$$
WHERE id = $$086-c-hdr-stools-rain$$;
UPDATE public.projects SET
  seo_title       = $$Rainy Bird Table Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-rainy-bird-table-squirrels-birds$$,
  seo_description = $$Rainy-day Cat TV: rain beads along the bird table while blackbirds and a squirrel jostle over the seed. Plenty of sudden, hoppy motion to keep an indoor cat locked on, tail flicking. On 24/7.$$,
  seo_blurb       = $$Wet bird table, hopping birds, a squirrel muscling in$$
WHERE id = $$087.1-c-hdr-birdtables-rain$$;
UPDATE public.projects SET
  seo_title       = $$Rainy Birds & Squirrels on the Bird Table — Cat TV$$,
  seo_slug        = $$cat-tv-rainy-birds-squirrels-bird-table$$,
  seo_description = $$On a drizzly afternoon the bird table fills with great tits and a soggy grey squirrel raiding the nuts, all for a stalking cat. Real footage built to spark an indoor cat's stalk-and-pounce instinct.$$,
  seo_blurb       = $$Drizzle, a busy bird table, a squirrel raiding nuts$$
WHERE id = $$087.2-c-hdr-birdtables-rain$$;
UPDATE public.projects SET
  seo_title       = $$Spring Squirrels & Birds Take Over the Garden Wall — Cat TV$$,
  seo_slug        = $$cat-tv-spring-squirrels-birds-take-over-garden-wall$$,
  seo_description = $$Sun warms the brick wall where spring flowers nod and jackdaws drop in beside a scrambling squirrel — a cat's window theatre. Endless quick darting for a restless cat to track and pounce at.$$,
  seo_blurb       = $$Spring flowers on the wall, birds and squirrels scrambling$$
WHERE id = $$090-c-hdr-wall-flowers-spring$$;
UPDATE public.projects SET
  seo_title       = $$Spring Cat TV: Squirrels & Birds at the Garden Stool$$,
  seo_slug        = $$cat-tv-spring-squirrels-birds-garden-stool$$,
  seo_description = $$Daffodils crowd the garden stool in March light as coal tits flit down and a squirrel claims the seed, set for a stalking cat. Twitchy, fast movement gives an indoor cat real prey to fixate on.$$,
  seo_blurb       = $$March daffodils, the stool, tits and a squirrel at the seed$$
WHERE id = $$091.1-c-hdr-stools-daffodils-march$$;
UPDATE public.projects SET
  seo_title       = $$Spring Squirrels & Birds on the Garden Stool — Cat TV$$,
  seo_slug        = $$cat-tv-spring-squirrels-birds$$,
  seo_description = $$Squirrels barge across the daffodil-ringed stool, sending robins off the spring seed — bright prey for a cat to track. Early-March footage that keeps a bored cat stalking and chattering at the glass.$$,
  seo_blurb       = $$Squirrels barging the stool through the daffodils$$
WHERE id = $$091.2-c-hdr-stools-daffodils-march$$;
UPDATE public.projects SET
  seo_title       = $$Garden Wall Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-garden-wall-squirrels-birds$$,
  seo_description = $$Potted plants line the wall and a magpie struts past as a squirrel pries at the nuts, real prey movement for a cat. Honest March footage made to set an indoor cat watching, tracking and ready to spring.$$,
  seo_blurb       = $$Pots on the wall, a magpie, a squirrel at the nuts$$
WHERE id = $$092-c-hdr-wall-pots-march$$;
UPDATE public.projects SET
  seo_title       = $$Patio Party Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-patio-party-squirrels-birds$$,
  seo_description = $$The patio buzzes as blue tits and squirrels scrap over seed in the thin March sun, a feast for a cat's eye. Fast, unpredictable movement gives a cooped-up cat plenty to lock onto and pounce at.$$,
  seo_blurb       = $$A busy March patio of scrapping birds and squirrels$$
WHERE id = $$093.1-c-hdr-patio-march$$;
UPDATE public.projects SET
  seo_title       = $$Peaceful Patio Party Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-peaceful-patio-party-squirrels-birds$$,
  seo_description = $$A quieter patio in early March gives a cat the odd robin and a lone squirrel picking at the nuts to watch. Still enough sudden movement to catch an indoor cat's eye and set its tail twitching.$$,
  seo_blurb       = $$Calmer patio, a robin and a squirrel to track$$
WHERE id = $$093.2-c-hdr-patio-march$$;
UPDATE public.projects SET
  seo_title       = $$Spring Cat TV: Squirrels & Birds at the Bird Table$$,
  seo_slug        = $$cat-tv-spring-squirrels-birds-bird-table$$,
  seo_description = $$Spring arrives at the bird table as great tits and a bold squirrel work the seed, quick prey for an indoor cat. Real footage with hoppy action to keep a cat fixed and ready to pounce.$$,
  seo_blurb       = $$Spring bird table, tits and a bold squirrel at the seed$$
WHERE id = $$094.1-c-hdr-birdtables-march$$;
UPDATE public.projects SET
  seo_title       = $$Spring Squirrels & Birds on the Bird Table — Cat TV$$,
  seo_slug        = $$cat-tv-spring-squirrels-birds-bird$$,
  seo_description = $$Squirrels take the bird table by storm, sending blackbirds off the March seed — darting targets for a cat to chase. Concrete garden footage that hands a bored cat prey to stalk and chatter at.$$,
  seo_blurb       = $$Squirrels storming the March bird table$$
WHERE id = $$094.2-c-hdr-birdtables-march$$;
UPDATE public.projects SET
  seo_title       = $$Lively Patio Party Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-lively-patio-party-squirrels-birds$$,
  seo_description = $$From a low patio angle, jackdaws and squirrels dart across the stones after seed and nuts, close enough to make a cat crouch. The lively, close movement gives an indoor cat real targets to track and spring on.$$,
  seo_blurb       = $$Low-angle patio, jackdaws and squirrels darting close$$
WHERE id = $$095.1-c-hdr-patio-angle-march$$;
UPDATE public.projects SET
  seo_title       = $$Rock Feast for Squirrels & Birds — Cat TV$$,
  seo_slug        = $$cat-tv-rock-feast-squirrels-birds$$,
  seo_description = $$Cat TV for an indoor cat: seed and nuts spread across the rocks by the fence draw coal tits and a quick squirrel. April footage with sharp, sudden motion to keep an indoor cat stalking and twitching.$$,
  seo_blurb       = $$A rock feast of seed and nuts, birds and a squirrel$$
WHERE id = $$096.1-c-hdr-rock-fence-april$$;
UPDATE public.projects SET
  seo_title       = $$Spring Squirrels & Birds Take Over the Bird Table — Cat TV$$,
  seo_slug        = $$cat-tv-spring-squirrels-birds-take-over-bird-table$$,
  seo_description = $$Under the budding tree the bird table fills with robins and a nut-raiding squirrel — easy prey for a watching cat. Flickering April light and fast movement give a restless cat plenty to fixate and pounce on.$$,
  seo_blurb       = $$Bird table under the tree, robins and a nut-raiding squirrel$$
WHERE id = $$097.1-c-hdr-birdtables-under-tree-apr$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels Raid the Nut Stash — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-raid-nut-stash$$,
  seo_description = $$For a bored indoor cat, a squirrel raids the nut stash heaped in the old wheelbarrow while woodpigeons crowd in. Quick, greedy darting gives real prey to track and chatter at.$$,
  seo_blurb       = $$A squirrel raiding the nut-filled wheelbarrow$$
WHERE id = $$098.1-c-hdr-nut-wheelbarrow-apr$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels & Birds on the Garden Stool — Cat TV$$,
  seo_slug        = $$squirrels-birds-garden-stool-cat-tv$$,
  seo_description = $$Close on the weathered garden stool, blue tits and a squirrel tussle over the April seed — fast prey for a cat. The tight, fast action keeps an indoor cat locked on, tail flicking, ready to spring.$$,
  seo_blurb       = $$Close-up stool, tits and a squirrel tussling over seed$$
WHERE id = $$100.1-c-hdr-logo-stools-close-apr$$;
UPDATE public.projects SET
  seo_title       = $$Peaceful Garden Stool Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-peaceful-garden-stool-squirrels-birds$$,
  seo_description = $$A cat can stalk this wider, quieter view of the garden stool, with robins dropping in and a lone squirrel at the nuts. Still enough sudden movement to set an indoor cat stalking and tracking.$$,
  seo_blurb       = $$Wider quiet stool, robins and a squirrel to stalk$$
WHERE id = $$100.2-c-hdr-logo-stools-not-as-close-apr$$;
UPDATE public.projects SET
  seo_title       = $$Birds & Squirrels on the Garden Feeders — Cat TV$$,
  seo_slug        = $$cat-tv-birds-squirrels-garden-feeders$$,
  seo_description = $$Purple and white blooms frame the feeders as great tits and a squirrel work the seed, real prey for a cat to stalk. Spring footage with quick, flitting motion for an indoor cat to fixate on and pounce at.$$,
  seo_blurb       = $$Flower-framed feeders, tits and a squirrel at the seed$$
WHERE id = $$102-c-hdr-logo-bird-feeders-purple-white-apr$$;
UPDATE public.projects SET
  seo_title       = $$Peaceful Squirrels & Birds Take Over the Bird Table — Cat TV$$,
  seo_slug        = $$cat-tv-peaceful-squirrels-birds-take-over$$,
  seo_description = $$Squirrels scrabble up the bird table while finches flit through a pink May bush, all quick darting movement to set a watching cat twitching. Real garden footage of loose seed and nuts being raided, streaming day and night.$$,
  seo_blurb       = $$Squirrels scrabble, birds flit — prime stalking practice$$
WHERE id = $$103.1-c-hdr-logo-birdtable-pink-bush-may$$;
UPDATE public.projects SET
  seo_title       = $$Lively Cat TV: Squirrels & Birds at the Bird Table$$,
  seo_slug        = $$cat-tv-lively-squirrels-birds-bird-table$$,
  seo_description = $$Birds bustle and squabble over the bird table as squirrels barge in, a busy May scramble built to grab an indoor cat's full attention. Blossom-pink bush behind, nuts and seed everywhere, on 24/7.$$,
  seo_blurb       = $$Busy May bird table — a feast for restless eyes$$
WHERE id = $$103.2-c-hdr-logo-birdtable-pink-bush-may$$;
UPDATE public.projects SET
  seo_title       = $$Peaceful Squirrels Raid the Nut Stash — Cat TV$$,
  seo_slug        = $$cat-tv-peaceful-squirrels-raid-nut-stash$$,
  seo_description = $$A grey squirrel scurries to the nut stash in a quieter garden, robins and tits flitting in to keep the prey worth tracking for a watching cat. Honest spring footage of seed and nuts, always on.$$,
  seo_blurb       = $$One squirrel, one nut stash, eyes locked on$$
WHERE id = $$105-c-hdr-logo-nuthouse-discover-may$$;
UPDATE public.projects SET
  seo_title       = $$Lively Squirrels Raid the Nut Stash — Cat TV$$,
  seo_slug        = $$cat-tv-lively-squirrels-raid-nut-stash$$,
  seo_description = $$Squirrels dart and jostle over the nut stash by a purple May bush, tails flicking, a fast-moving raid to spark a cat's pounce reflex. Coal tits and blackbirds dip in around them on real garden footage.$$,
  seo_blurb       = $$Squirrels dart the nut stash — pure pounce-bait$$
WHERE id = $$106-c-hdr-logo-nuthouse-purple-bush-may$$;
UPDATE public.projects SET
  seo_title       = $$Spring Birds & Squirrels on the Bird Table — Cat TV$$,
  seo_slug        = $$cat-tv-spring-birds-squirrels-bird-table$$,
  seo_description = $$Blue tits hop and flit across the bird table while peonies bloom behind, every quick movement a cue for a stalking indoor cat. Squirrels muscle in for seed and nuts in this true spring scene, streaming round the clock.$$,
  seo_blurb       = $$Spring peonies, hopping birds — track every flit$$
WHERE id = $$107-c-hdr-logo-birdtable-peonies-may$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels & Birds Take Over the Garden Lawn — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-birds-take-over-garden-lawn$$,
  seo_description = $$A squirrel scampers across the lawn and onto its rock while woodpigeons strut the grass, low darting motion to keep a cat crouched and watching. Real May garden footage scattered with seed and nuts.$$,
  seo_blurb       = $$Lawn squirrels and strutting pigeons to stalk$$
WHERE id = $$108-c-hdr-squirrel-rock-may$$;
UPDATE public.projects SET
  seo_title       = $$Cat TV: Squirrels & Birds at the Garden Wall$$,
  seo_slug        = $$squirrels-birds-garden-wall-cat-tv$$,
  seo_description = $$Along the sunlit brick wall, magpies hop between the bricks as a squirrel swoops down for nuts — restless movement to grip a bored cat. Genuine garden footage of seed and nuts, on day and night.$$,
  seo_blurb       = $$Sunny wall, hopping magpies — feline lookout duty$$
WHERE id = $$109-c-hdr-logo-sunny-wall-bricks-may$$;
UPDATE public.projects SET
  seo_title       = $$Starlings Mob the Feeder — Cat TV$$,
  seo_slug        = $$cat-tv-starlings-mob-feeder$$,
  seo_description = $$Starlings mob the feeder in a flapping June frenzy, wings and squabbles everywhere to send a watching cat into full hunt mode. Squirrels raid the spilled seed and nuts below on real garden footage.$$,
  seo_blurb       = $$Starling frenzy at the feeder — flapping chaos to chase$$
WHERE id = $$112-c-hdr-feeders-starling-frenzy-jun$$;
UPDATE public.projects SET
  seo_title       = $$Garden Lawn Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-garden-lawn-squirrels-birds$$,
  seo_description = $$Beneath the feeders, sparrows scrabble for fallen seed while a squirrel scamps across the lawn — ground-level darting to keep a cat low and locked. Honest June garden footage of seed and nuts.$$,
  seo_blurb       = $$Under the feeders — ground-level prey to track$$
WHERE id = $$113.1-c-hdr-under-feeders-jun$$;
UPDATE public.projects SET
  seo_title       = $$Birds & Squirrels on the Garden Lawn — Cat TV$$,
  seo_slug        = $$cat-tv-birds-squirrels-garden-lawn$$,
  seo_description = $$On the green June lawn, birds dash and squirrels bustle for scattered seed and nuts, constant motion built to hold a restless indoor cat. Real footage of the garden floor, streaming day and night.$$,
  seo_blurb       = $$Birds dash, squirrels bustle on the summer lawn$$
WHERE id = $$113.2-c-hdr-under-feeders-jun$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels on the Tyre Swing — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-tyre-swing$$,
  seo_description = $$A squirrel swings and scrabbles over the tyre swing, an acrobatic July raid that pulls a watching cat to the edge of a pounce. Birds flit past for seed and nuts in this real garden footage, always on.$$,
  seo_blurb       = $$Squirrel acrobatics on the tyre swing — eyes up$$
WHERE id = $$115-c-hdr-squirrel-tyre-jul$$;
UPDATE public.projects SET
  seo_title       = $$Busy Cat TV: Squirrels & Birds at the Bird Table$$,
  seo_slug        = $$cat-tv-busy-squirrels-birds-bird-table$$,
  seo_description = $$Birds flit and squabble across the bird table as squirrels jostle in, a packed July scramble of darting movement to rivet a bored cat. True garden footage of loose seed and nuts, on round the clock.$$,
  seo_blurb       = $$Packed July bird table — constant flutter to chase$$
WHERE id = $$116-c-hdr-birdtables-jul$$;
UPDATE public.projects SET
  seo_title       = $$Afternoon Tea Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-afternoon-tea-squirrels-birds$$,
  seo_description = $$Squirrels raid the afternoon-tea spread while robins and tits dart between the plates, fidgety movement to keep an indoor cat stalking. Genuine garden footage of seed and nuts laid out, streaming day and night.$$,
  seo_blurb       = $$Afternoon tea raided — darting birds to track$$
WHERE id = $$117.1-c-hdr-afternoon-tea$$;
UPDATE public.projects SET
  seo_title       = $$Garden Table Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-garden-table-squirrels-birds$$,
  seo_description = $$On the wooden garden table, birds hop and squirrels scamper across the boards for seed and nuts, busy close-up motion to spark a cat's chase. Real footage of the tabletop, on 24/7.$$,
  seo_blurb       = $$Wooden table bustle — hopping, scampering prey$$
WHERE id = $$119-c-hdr-table-wood-server$$;
UPDATE public.projects SET
  seo_title       = $$Summer Birds & Squirrels on the Garden Lawn — Cat TV$$,
  seo_slug        = $$cat-tv-summer-birds-squirrels-garden-lawn$$,
  seo_description = $$A squirrel dashes onto the round stone slab as summer birds flit low across the lawn, quick movement to hold a watching cat in a crouch. Honest footage of seed and nuts in the warm garden.$$,
  seo_blurb       = $$Summer slab and lawn — flitting prey to fix on$$
WHERE id = $$120-c-hdr-round-slab$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels & Birds at the Birdbath — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-birds-birdbath$$,
  seo_description = $$Blackbirds splash and flap at the birdbath while squirrels scurry past, wet flurries of movement to send a cat into a stalking stare. Real garden footage with seed and nuts nearby, always on.$$,
  seo_blurb       = $$Splashing birds at the birdbath — flapping to watch$$
WHERE id = $$121-c-hdr-birdbath$$;
UPDATE public.projects SET
  seo_title       = $$Spooky Halloween Squirrels Among the Skulls — Cat TV$$,
  seo_slug        = $$cat-tv-spooky-halloween-squirrels-among-skulls$$,
  seo_description = $$Squirrels scamper among the Halloween skulls and mock graves, darting between the bones as birds flit overhead to grip a watching cat. Real footage with seed and nuts, on day and night.$$,
  seo_blurb       = $$Squirrels among the Halloween skulls — eerie prey to stalk$$
WHERE id = $$122-c-hdr-halloween-skulls-graves$$;
UPDATE public.projects SET
  seo_title       = $$Peaceful Halloween Squirrels Among the Skulls — Cat TV$$,
  seo_slug        = $$cat-tv-peaceful-halloween-squirrels-among-skulls$$,
  seo_description = $$A lone squirrel scrabbles up the Halloween skull tower in a quieter garden, slow then sudden movement to keep a watching cat fixed. Genuine footage with seed and nuts, streaming round the clock.$$,
  seo_blurb       = $$Squirrel climbs the skull tower — watch and wait$$
WHERE id = $$123-c-hdr-halloween-skull-tower$$;
UPDATE public.projects SET
  seo_title       = $$Lively Halloween Squirrels Among the Skulls — Cat TV$$,
  seo_slug        = $$cat-tv-lively-halloween-squirrels-among-skulls$$,
  seo_description = $$Squirrels swarm the skull-topped tyre, scrabbling and squabbling over nuts in a lively Halloween scramble that fires a cat's pounce. Birds dart through the spooky props on real garden footage, always on.$$,
  seo_blurb       = $$Lively skull-tyre scramble — squirrels to pounce on$$
WHERE id = $$124-c-hdr-halloween-skull-tyre$$;
UPDATE public.projects SET
  seo_title       = $$Busy Squirrels in the Pumpkin Patch — Halloween Cat TV$$,
  seo_slug        = $$cat-tv-busy-squirrels-pumpkin-patch-halloween$$,
  seo_description = $$Grey squirrels scramble over a Halloween pumpkin patch, darting between the gourds for nuts — spooky prey for a cat to track. Real footage to set an indoor cat stalking and chattering at every quick move. Streams day and night.$$,
  seo_blurb       = $$Squirrels raid the pumpkin patch — Halloween prey for your cat to track$$
WHERE id = $$125-c-hdr-pumpkin-patch$$;
UPDATE public.projects SET
  seo_title       = $$Quiet Squirrels in the Pumpkin Patch — Halloween Cat TV$$,
  seo_slug        = $$cat-tv-quiet-squirrels-pumpkin-patch-halloween$$,
  seo_description = $$On a still Halloween morning a lone squirrel picks among the pumpkins, small prey to sharpen a watching cat. Quieter, but every twitch and dash gives a bored cat something to fix on and pounce.$$,
  seo_blurb       = $$Quiet pumpkin-patch squirrels — slow movement to sharpen a cat's eye$$
WHERE id = $$126-c-hdr-pumpkin-rock$$;
UPDATE public.projects SET
  seo_title       = $$Bright Squirrels in the Pumpkin Patch — Halloween Cat TV$$,
  seo_slug        = $$cat-tv-bright-squirrels-pumpkin-patch-halloween$$,
  seo_description = $$Bright autumn light spills across the pumpkin-topped bench as squirrels and blue tits dart for a cat to track. Crisp, fast garden action made to trigger an indoor cat's hunting instinct.$$,
  seo_blurb       = $$Bright pumpkin-bench squirrels — autumn darting for a cat to pounce at$$
WHERE id = $$127.1-c-hdr-pumpkin-bench-main$$;
UPDATE public.projects SET
  seo_title       = $$Bully Pigeon vs Squirrels — Cat TV$$,
  seo_slug        = $$cat-tv-bully-pigeon-vs-squirrels$$,
  seo_description = $$A bullying woodpigeon muscles in, sending squirrels off the seed in a flurry of wings and tails for a cat to follow. The sudden chase keeps a restless cat tracking every fast move. Real garden footage, always on.$$,
  seo_blurb       = $$Pigeon bullies the squirrels — a scramble for your cat to follow$$
WHERE id = $$127.2-c-hdr-pumpkin-bench-attack$$;
UPDATE public.projects SET
  seo_title       = $$Sunny Squirrels in the Pumpkin Patch — Halloween Cat TV$$,
  seo_slug        = $$cat-tv-sunny-squirrels-pumpkin-patch-halloween$$,
  seo_description = $$Warm sunset glow lights the pumpkin bench while squirrels make a last raid and a cat watches the darting. Golden-hour movement to keep an indoor cat stalking and twitching.$$,
  seo_blurb       = $$Sunset pumpkin-patch squirrels — golden-hour prey to stalk$$
WHERE id = $$127.3-c-hdr-pumpkin-bench-sunset$$;
UPDATE public.projects SET
  seo_title       = $$Busy Halloween Squirrels Among the Skulls — Cat TV$$,
  seo_slug        = $$cat-tv-busy-halloween-squirrels-among-skulls$$,
  seo_description = $$Squirrels clamber over mossy skulls grabbing nuts among the Halloween graves — pure stalking fuel for a bored cat. Spooky set dressing, but the fast scurrying gives plenty to lock onto.$$,
  seo_blurb       = $$Busy squirrels among the skulls — Halloween scurry for your cat$$
WHERE id = $$129.1-c-hdr-halloween-graves-hands$$;
UPDATE public.projects SET
  seo_title       = $$Quiet Halloween Squirrels Among the Skulls — Cat TV$$,
  seo_slug        = $$cat-tv-quiet-halloween-squirrels-among-skulls$$,
  seo_description = $$Among the Halloween skulls a single squirrel forages slowly, a small darting target for a watching cat. A hushed graveyard scene that still gives an indoor cat targets to track and pounce.$$,
  seo_blurb       = $$Quiet graveyard squirrels — eerie calm, with prey for a cat to watch$$
WHERE id = $$129.2-c-hdr-halloween-graves-hands$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels by the Carved Pumpkins — Halloween Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-carved-pumpkins-halloween$$,
  seo_description = $$Carved jack-o'-lanterns grin while squirrels weave between them for nuts, lively enough to set a cat chattering at the glass. Flickering Halloween scene with magpies strutting past.$$,
  seo_blurb       = $$Squirrels by the carved pumpkins — Halloween prey to chase$$
WHERE id = $$130.1-c-hdr-halloween-pumpkins-carved$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels Squabble by Carved Pumpkins — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-squabble-carved-pumpkins$$,
  seo_description = $$Two squirrels squabble over nuts beside the carved pumpkins, a fast target for a restless indoor cat to lock onto. Tails flicking as they chase each other off, ready to pounce.$$,
  seo_blurb       = $$Squirrels squabble at the pumpkins — a chase for your cat to track$$
WHERE id = $$130.2-c-hdr-halloween-pumpkins-carved$$;
UPDATE public.projects SET
  seo_title       = $$Lively Christmas Squirrels & Birds — Cat TV$$,
  seo_slug        = $$cat-tv-lively-christmas-squirrels-birds$$,
  seo_description = $$Toy nutcrackers line the festive wall as squirrels and great tits dart for seed below, festive prey for a cat. Lively Christmas action built to keep an indoor cat stalking and twitching through the holidays.$$,
  seo_blurb       = $$Lively Christmas squirrels on the wall — festive prey to pounce at$$
WHERE id = $$132-c-hdr-xmas-wall-nutcrackers$$;
UPDATE public.projects SET
  seo_title       = $$Frosty Cat TV: Christmas Squirrels & Birds$$,
  seo_slug        = $$cat-tv-frosty-christmas-squirrels-birds$$,
  seo_description = $$Frost rimes the Christmas sled while squirrels dash across it for nuts, sharp movement to fire a cat's hunting instinct. Crisp and cold, with a robin guarding the seed.$$,
  seo_blurb       = $$Frosty Christmas sled squirrels — icy darting for your cat$$
WHERE id = $$133-c-hdr-xmas-sled-frost$$;
UPDATE public.projects SET
  seo_title       = $$Christmas Squirrels & Birds in the Snow — Cat TV$$,
  seo_slug        = $$cat-tv-christmas-squirrels-birds-snow$$,
  seo_description = $$Snow blankets the festive sled as squirrels bound through powder and jackdaws lift off the drifts — wintry prey for a cat to watch. Christmas footage with plenty of fast motion for an indoor cat to track and chase.$$,
  seo_blurb       = $$Snowy Christmas squirrels & birds — winter prey to stalk$$
WHERE id = $$134-c-hdr-xmas-sled-snow$$;
UPDATE public.projects SET
  seo_title       = $$Peaceful Festive Squirrels & Birds — Christmas Cat TV$$,
  seo_slug        = $$cat-tv-peaceful-festive-squirrels-birds-christmas$$,
  seo_description = $$A hush settles over the festive patio where a squirrel picks at nuts, still full of small darts for a cat to fix on. Blue tits flit by among the Christmas trims in a quieter holiday scene.$$,
  seo_blurb       = $$Festive patio squirrels — gentle holiday movement to track$$
WHERE id = $$135-c-hdr-xmas-patio$$;
UPDATE public.projects SET
  seo_title       = $$Busy Christmas Squirrels & Birds — Cat TV$$,
  seo_slug        = $$cat-tv-busy-christmas-squirrels-birds$$,
  seo_description = $$Busy squirrels raid the Christmas bird table past the nutcrackers, festive bustle to keep an indoor cat pouncing. Blackbirds and tits jostle for seed in lively festive action.$$,
  seo_blurb       = $$Busy Christmas bird-table squirrels — festive bustle to chase$$
WHERE id = $$136-c-hdr-xmas-birdtable-nutcrackers$$;
UPDATE public.projects SET
  seo_title       = $$Cat TV: Squirrels & Birds in the Frost$$,
  seo_slug        = $$cat-tv-squirrels-birds-frost$$,
  seo_description = $$Frost coats the garden stools at first light as squirrels skitter across for nuts and robins puff up — cold prey for a bored cat. Crisp winter movement to set a bored cat stalking the glass.$$,
  seo_blurb       = $$Frosty-stool squirrels & birds — cold-morning prey to track$$
WHERE id = $$250104-c-hdr-frosty-stools$$;
UPDATE public.projects SET
  seo_title       = $$Frosty Garden Stool Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-frosty-garden-stool-squirrels-birds$$,
  seo_description = $$One squirrel hands off to the next at the frosted stool, a relay of dashes for the seed while coal tits dart between — brisk prey for a cat. Icy action for an indoor cat to lock onto and pounce.$$,
  seo_blurb       = $$Frosty stool squirrels in relay — quick winter darts to chase$$
WHERE id = $$250111-c-hdr-frosty-stools-handover$$;
UPDATE public.projects SET
  seo_title       = $$Winter Bully Pigeon vs Squirrels — Cat TV$$,
  seo_slug        = $$cat-tv-winter-bully-pigeon-vs-squirrels$$,
  seo_description = $$Cat TV for an indoor cat: a bullying pigeon dominates the winter bird tables, shoving squirrels off the seed by the bare tree. The shove-and-scatter keeps a restless cat tracking every sudden move. Real footage, on 24/7.$$,
  seo_blurb       = $$Winter pigeon bullies the squirrels — a scramble for your cat$$
WHERE id = $$250201-c-hdr-birdtables-tree$$;
UPDATE public.projects SET
  seo_title       = $$Winter Cat TV: Squirrels & Birds at the Garden Lawn$$,
  seo_slug        = $$cat-tv-winter-squirrels-birds-garden-lawn$$,
  seo_description = $$For a bored indoor cat, a frosty morning glazes the lawn where squirrels forage for nuts and a magpie patrols the rock. Cold, clear and busy — fast garden movement to fire an indoor cat's hunting instinct.$$,
  seo_blurb       = $$Frosty-morning lawn squirrels & birds — winter prey to stalk$$
WHERE id = $$250228-c-hdr-frosty-morning-rock$$;
UPDATE public.projects SET
  seo_title       = $$Frosty Cat TV: Squirrels & Birds in the Frost$$,
  seo_slug        = $$cat-tv-frosty-squirrels-birds-frost$$,
  seo_description = $$Frost clings to the weathered old stool as a squirrel balances across it for nuts, real prey movement for a cat to stalk. Sharp, cold darting to give a bored indoor cat something to track and pounce on.$$,
  seo_blurb       = $$Frosty old-stool squirrels & birds — icy darts to chase$$
WHERE id = $$250302-c-hdr-frosty-old-stool$$;
UPDATE public.projects SET
  seo_title       = $$Spring Bird Table Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-spring-bird-table-squirrels-birds$$,
  seo_description = $$Early on a spring morning the first squirrels scramble onto the bird table — busy little targets for a watching cat to lock onto. Real garden footage to set an indoor cat stalking and chattering. Streams day and night.$$,
  seo_blurb       = $$Dawn raiders on the spring bird table for a watching cat$$
WHERE id = $$250308-c-hdr-birdtables$$;
UPDATE public.projects SET
  seo_title       = $$Spring Squirrels & Birds on the Garden Wall — Cat TV$$,
  seo_slug        = $$cat-tv-spring-squirrels-birds-garden-wall$$,
  seo_description = $$Squirrels balance along the brick garden wall, tails flicking, as woodpigeons and great tits drop in for nuts — quick prey for a cat. Darting movement that pulls a bored cat to the glass to track and pounce.$$,
  seo_blurb       = $$Spring wall traffic: squirrels and birds to track$$
WHERE id = $$250308-c-hdr-wall-bricks$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels Raid the Nut Platter — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-raid-nut-platter$$,
  seo_description = $$A lone squirrel finds the nut platter first, then more barge in to wrestle over the haul — fast prey to set a house cat's tail twitching. Blackbirds wait their turn while the scrap plays out.$$,
  seo_blurb       = $$Squirrels fight over the nut platter — cat-stalk fuel$$
WHERE id = $$250313-c-hdr-table-wall$$;
UPDATE public.projects SET
  seo_title       = $$March Cat TV: Squirrels & Birds at the Garden Stool$$,
  seo_slug        = $$cat-tv-march-squirrels-birds-garden-stool$$,
  seo_description = $$On the weathered March stool, coal tits dart for seed between visits from a bold grey squirrel — busy little targets for a cat. A patch of cold sun and plenty for a restless indoor cat to fix on and hunt.$$,
  seo_blurb       = $$March stool, busy birds, one cheeky squirrel$$
WHERE id = $$250321-c-hdr-rip-old-stool$$;
UPDATE public.projects SET
  seo_title       = $$Spring Squirrels & Birds on the Garden Lawn — Cat TV$$,
  seo_slug        = $$cat-tv-spring-squirrels-birds-garden-lawn$$,
  seo_description = $$Across the sunlit spring lawn, squirrels bound after dropped nuts while jackdaws and a robin pick through the grass for a cat to stalk. Quick real darting and hopping to keep a watching cat alert.$$,
  seo_blurb       = $$Sunny lawn hops and dashes for a stalking cat$$
WHERE id = $$250411-c-hdr-sunny-plant-stand$$;
UPDATE public.projects SET
  seo_title       = $$Spring Garden Fountain Cat TV — Squirrels & Birds$$,
  seo_slug        = $$cat-tv-spring-garden-fountain-squirrels-birds$$,
  seo_description = $$Around the garden fountain, blue tits and a blackbird flit to the water's edge — flickering motion for a cat to track and chatter at. A squirrel skirts the rim for spilled seed at every angle.$$,
  seo_blurb       = $$Fountain-side flits and dashes to pounce at$$
WHERE id = $$250420-c-hdr-fountain$$;
UPDATE public.projects SET
  seo_title       = $$Afternoon Birds & Squirrels on the Garden Lawn — Cat TV$$,
  seo_slug        = $$cat-tv-afternoon-birds-squirrels-garden-lawn$$,
  seo_description = $$A quiet afternoon on the lawn draws a watching cat in: one robin works the grass before squirrels and woodpigeons crowd in for nuts. Steady prey movement that pulls a bored cat to stalk, track and pounce.$$,
  seo_blurb       = $$Afternoon lawn build-up from one bird to a crowd$$
WHERE id = $$250427-c-hdr-rock-under-bush$$;
UPDATE public.projects SET
  seo_title       = $$May Squirrels & Birds Take Over the Garden Stool — Cat TV$$,
  seo_slug        = $$cat-tv-may-squirrels-birds-take-over$$,
  seo_description = $$By the silver birch, squirrels take over the new garden stool, shoving past great tits — quick bursts for an indoor cat to lock onto. Set a cat crouched, twitching and ready to spring.$$,
  seo_blurb       = $$May: squirrels seize the stool by the birch$$
WHERE id = $$250505-c-hdr-new-stool-birch$$;
UPDATE public.projects SET
  seo_title       = $$Spring Starlings Mob the Feeder — Cat TV$$,
  seo_slug        = $$cat-tv-spring-starlings-mob-feeder$$,
  seo_description = $$A noisy gang of starlings mobs the feeder, jostling and squabbling — irresistible prey movement for a watching cat. A squirrel tries to muscle in below the frantic wings and flicking heads.$$,
  seo_blurb       = $$Starling mob at the feeder for a cat to track$$
WHERE id = $$250520-c-hdr-stools-starlings$$;
UPDATE public.projects SET
  seo_title       = $$Fledglings Beg for Food — Cat TV$$,
  seo_slug        = $$cat-tv-fledglings-beg-food$$,
  seo_description = $$Fluffed-up fledglings flutter and beg at the feeder stand, twitchy unpredictable motion to set a house cat stalking the glass. Harried parent starlings shuttle seed back and forth.$$,
  seo_blurb       = $$Begging fledglings flutter — pounce-worthy motion$$
WHERE id = $$250522-c-hdr-starlings-feeder-stand$$;
UPDATE public.projects SET
  seo_title       = $$Winter Squirrels Raid the Nut Stash — Cat TV$$,
  seo_slug        = $$cat-tv-winter-squirrels-raid-nut-stash$$,
  seo_description = $$In the cold winter light, squirrels raid the nut stash on the table, cheeks bulging — quick greedy movement to put a cat on full alert. They dart off and rush back again and again.$$,
  seo_blurb       = $$Winter squirrels raid the nut stash — stalk bait$$
WHERE id = $$260129-c-hdr-table-nuts-squirrels$$;
UPDATE public.projects SET
  seo_title       = $$Winter Birds & Squirrels on the Bird Table — Cat TV$$,
  seo_slug        = $$cat-tv-winter-birds-squirrels-bird-table$$,
  seo_description = $$On the frosted bird table, robins and coal tits dart in for seed between squirrels scrapping over nuts, sharp motion to keep a cat tracking. A bored cat is left chattering and ready to pounce.$$,
  seo_blurb       = $$Frosty bird table: birds dart, squirrels scrap$$
WHERE id = $$260204-c-hdr-birdtable$$;
UPDATE public.projects SET
  seo_title       = $$Squirrels & Birds Party on the Rocks — Cat TV$$,
  seo_slug        = $$cat-tv-squirrels-birds-party-rocks$$,
  seo_description = $$Squirrels and birds throw a party across the rock border, hopping stone to stone after the seed — nonstop action for a cat to track. Constant darting at every level for an indoor cat to lock onto and stalk.$$,
  seo_blurb       = $$Rock-border scramble of birds and squirrels$$
WHERE id = $$260217-c-hdr-rock-border$$;
UPDATE public.projects SET
  seo_title       = $$Winter Cat TV: Squirrels & Birds at the Bird Table$$,
  seo_slug        = $$cat-tv-winter-squirrels-birds-bird-table$$,
  seo_description = $$Winter mornings bring magpies and a wary squirrel to the bird table — picking and pouncing prey for a crouched cat. Real cold-weather footage to set a watching cat twitching.$$,
  seo_blurb       = $$Winter bird-table visitors to crouch and watch$$
WHERE id = $$260224-c-hdr-birdtables-new$$;
UPDATE public.projects SET
  seo_title       = $$Morning Squirrels & Birds on the Garden Wall — Cat TV$$,
  seo_slug        = $$cat-tv-morning-squirrels-birds-garden-wall$$,
  seo_description = $$Just after sunrise, squirrels patrol the garden wall while blackbirds and blue tits work the seed below — early movement for a cat. Prey enough to draw a restless indoor cat to the window to track and hunt.$$,
  seo_blurb       = $$Sunrise wall patrol — early movement to stalk$$
WHERE id = $$260302-c-sdr-wall$$;

-- =====================================================================
-- DOG - Harmony Hounds (harmonyhoundsdogtv) - 64 projects
-- =====================================================================

UPDATE public.projects SET
  seo_title       = $$Woodland Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-woodland-walk$$,
  seo_description = $$Calming dog TV: a soft path runs through ancient oak and beech, dappled light shifting over leaf litter. Real footage of a slow woodland walk, made for an anxious dog to settle to at home.$$,
  seo_blurb       = $$A steady woodland walk through dappled oak and beech$$
WHERE id = $$018-d-hdr-kings-hat$$;
UPDATE public.projects SET
  seo_title       = $$Dog TV: Calming Forest Walk$$,
  seo_slug        = $$dog-tv-calming-forest-walk$$,
  seo_description = $$For a restless dog, the trail winds between silver birch as bluebells spill across the mossy floor. A gentle, unhurried forest walk for a restless or home-alone dog to ease into.$$,
  seo_blurb       = $$Bluebells and birch on a quiet, slow forest trail$$
WHERE id = $$021-d-hdr-bluebell-woods$$;
UPDATE public.projects SET
  seo_title       = $$Calming Forest Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-calming-forest$$,
  seo_description = $$Through dense beech the walk keeps an easy pace for a watching dog, ferns brushing past and birdsong threading the air. Calming real footage for a dog left alone to settle beside.$$,
  seo_blurb       = $$Easy pace through fern-lined beech woodland$$
WHERE id = $$025-d-hdr-dibden-inclosure$$;
UPDATE public.projects SET
  seo_title       = $$Virtual Dog Walk in Ancient Woodland — Dog TV$$,
  seo_slug        = $$dog-tv-virtual-walk-ancient-woodland$$,
  seo_description = $$Beneath a high canopy of ancient oak, a slow path of moss and holly gives a dog a gentle scene to wind down to. Filmed as real woodland footage for an unsettled dog at home.$$,
  seo_blurb       = $$A slow path beneath old oaks and holly$$
WHERE id = $$032-d-hdr-furzey$$;
UPDATE public.projects SET
  seo_title       = $$Coastal Dog Walk by the Sea — Dog TV$$,
  seo_slug        = $$dog-tv-coastal-walk-sea$$,
  seo_description = $$A quiet shore unfolds for an anxious dog, gentle waves folding over shingle and sea air drifting in. This calm coastal walk streams day and night for a dog to relax beside at home.$$,
  seo_blurb       = $$Gentle waves and shingle on a calm, open shore$$
WHERE id = $$033-d-hdr-lepe$$;
UPDATE public.projects SET
  seo_title       = $$Summer Woodland Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-summer-woodland-walk$$,
  seo_description = $$Warm summer light filters through oak and beech onto dry bracken, a slow walk for a home-alone dog. A steady woodland scene to help a dog settle on a long afternoon.$$,
  seo_blurb       = $$Summer light through full bracken-edged woodland$$
WHERE id = $$040-d-hdr-pig-bush$$;
UPDATE public.projects SET
  seo_title       = $$Peaceful Dog TV: Calming Forest Walk$$,
  seo_slug        = $$dog-tv-peaceful-calming-forest-walk$$,
  seo_description = $$Shallow water mirrors the trees where the forest floor has flooded into still pools — a quiet scene for a restless dog. A peaceful, slow-paced walk to quietly unwind with.$$,
  seo_blurb       = $$Glassy flooded pools among the quiet trees$$
WHERE id = $$051-d-hdr-flooded-forest$$;
UPDATE public.projects SET
  seo_title       = $$Autumn Calming Forest Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-autumn-calming-forest-walk$$,
  seo_description = $$Autumn leaves carpet the path in copper and gold as the walk drifts past beech for a settling dog. Real seasonal footage, made gentle and slow for an anxious dog at home.$$,
  seo_blurb       = $$Copper leaf litter on a slow autumn beech walk$$
WHERE id = $$064-d-hdr-dibden-inclosure$$;
UPDATE public.projects SET
  seo_title       = $$Morning Virtual Dog Walk in Ancient Woodland — Dog TV$$,
  seo_slug        = $$dog-tv-morning-virtual-walk-ancient-woodland$$,
  seo_description = $$Dog TV for the early hours: morning light slants low through the trees, mist lifting as the dawn chorus builds. A slow walk for a home-alone dog to wake gently with.$$,
  seo_blurb       = $$Low morning light and dawn chorus in old woodland$$
WHERE id = $$068-d-hdr-shatterford$$;
UPDATE public.projects SET
  seo_title       = $$Nature Walk for Dogs — Dog TV$$,
  seo_slug        = $$dog-tv-nature-walk-dogs$$,
  seo_description = $$Ferns crowd a winding trail beneath tall oak, soft underfoot — a gentle nature walk for a restless dog. Made for an anxious dog to settle into at home.$$,
  seo_blurb       = $$A fern-thick trail under soft, mossy oak$$
WHERE id = $$075-d-hdr-fawley-inclosure$$;
UPDATE public.projects SET
  seo_title       = $$Peaceful Woodland Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-peaceful-woodland-walk$$,
  seo_description = $$Sunlight dapples a hushed beech and birch path, quiet underfoot, paced slow for a home-alone dog. This peaceful woodland walk is steady enough for a dog to relax beside.$$,
  seo_blurb       = $$Dappled, hushed beech path at an easy pace$$
WHERE id = $$076-d-hdr-dibden-inclosure$$;
UPDATE public.projects SET
  seo_title       = $$Sunny Dog TV: Calming Forest Walk$$,
  seo_slug        = $$dog-tv-sunny-calming-forest-walk$$,
  seo_description = $$As dusk settles a dog at home, golden glow spills low across heather and gorse and the walk slows. A warm, calming scene for an anxious dog to wind down to as the day fades.$$,
  seo_blurb       = $$Sunset glow over heather and gorse at dusk$$
WHERE id = $$078-d-hdr-moonhills-sunset$$;
UPDATE public.projects SET
  seo_title       = $$Winter Calming Forest Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-winter-calming-forest-walk$$,
  seo_description = $$Frost stiffens the bracken on a still winter trail through bare beech, a slow scene for a restless dog. A calming walk for a dog to settle to indoors.$$,
  seo_blurb       = $$Frosted bracken on a still winter forest walk$$
WHERE id = $$083-d-hdr-shatterford$$;
UPDATE public.projects SET
  seo_title       = $$Sunny Virtual Dog Walk in Ancient Woodland — Dog TV$$,
  seo_slug        = $$dog-tv-sunny-virtual-walk-ancient-woodland$$,
  seo_description = $$Bright sun pours through the canopy, warming the moss and lighting a slow oak path for a home-alone dog. A gentle virtual walk made for a dog to ease into.$$,
  seo_blurb       = $$Sunlit moss and old oak on an unhurried walk$$
WHERE id = $$088-d-hdr-matley-wood$$;
UPDATE public.projects SET
  seo_title       = $$Winter Nature Walk for Dogs — Dog TV$$,
  seo_slug        = $$dog-tv-winter-nature-walk-dogs$$,
  seo_description = $$Calming dog TV: snow settles over the woodland floor, muffling every step beneath bare beech and holly. This quiet winter nature walk streams day and night for an anxious dog to settle beside.$$,
  seo_blurb       = $$Snow-muffled steps through bare winter woodland$$
WHERE id = $$089-d-hdr-dibden-inclosure$$;
UPDATE public.projects SET
  seo_title       = $$Bluebell Woodland Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-bluebell-woodland-walk$$,
  seo_description = $$For a restless dog, a haze of bluebells spreads beneath the trees as the trail meanders through dappled light. A slow, soothing woodland walk for a restless or home-alone dog to quietly settle to.$$,
  seo_blurb       = $$A bluebell haze along a dappled woodland trail$$
WHERE id = $$099-d-hdr-bluebell-woods$$;
UPDATE public.projects SET
  seo_title       = $$Quiet Dog TV: Calming Forest Walk$$,
  seo_slug        = $$dog-tv-quiet-calming-forest-walk$$,
  seo_description = $$For a dog left alone, this slow woodland walk gives anxious paws something gentle to settle into. Dappled light filters through ancient oaks as the path winds past mossy ground and fern. Real footage that drifts on, unhurried.$$,
  seo_blurb       = $$Slow woodland calm for a dog who hates being left alone$$
WHERE id = $$104-d-hdr-pig-bush-may$$;
UPDATE public.projects SET
  seo_title       = $$Finnish Forest Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-finnish-forest-walk$$,
  seo_description = $$A restless dog can ease down to this steady wander through tall Finnish pine forest, where Nordic light slips between the trunks. The carpet of needles muffles each step as the trail leads quietly on.$$,
  seo_blurb       = $$Tall Finnish pines and quiet steps for a pacing dog$$
WHERE id = $$110-d-hdr-raisio-onni-may$$;
UPDATE public.projects SET
  seo_title       = $$Ponies & Foals on the Heath — Dog TV$$,
  seo_slug        = $$dog-tv-ponies-foals-heath$$,
  seo_description = $$Free-roaming ponies and their leggy foals graze the open heath while a home-alone dog watches and unwinds. Gorse and heather stretch out under a wide June sky, the scene moving at its own slow pace.$$,
  seo_blurb       = $$Ponies and foals grazing the heath to soothe a lonely dog$$
WHERE id = $$111-d-hdr-kings-hat-jun$$;
UPDATE public.projects SET
  seo_title       = $$Ponies in the Gorse — Calming Dog TV$$,
  seo_slug        = $$dog-tv-ponies-gorse-calming$$,
  seo_description = $$Ponies pick through tangled gorse on the heath, a gentle sight to steady an anxious dog through the day. Bracken and heather frame the trail, with birdsong threaded softly underneath.$$,
  seo_blurb       = $$Heath ponies in the gorse for an anxious dog at home$$
WHERE id = $$114-d-hdr-dibden-inclosure$$;
UPDATE public.projects SET
  seo_title       = $$Heathland Woodland Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-heathland-woodland-walk$$,
  seo_description = $$Wandering through heather and silver birch, this unhurried walk helps a restless dog left at home find its calm. The woodland edge opens onto purple heath where ferns nod in the breeze.$$,
  seo_blurb       = $$Heather, birch and quiet woodland for a restless dog$$
WHERE id = $$118-d-hdr-dibden-inclosure-heather$$;
UPDATE public.projects SET
  seo_title       = $$Misty Forest Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-misty-forest-walk$$,
  seo_description = $$Mist hangs low between the oaks as a soft path threads through the fog, easing a dog that paces when alone. Shapes of holly and birch loom and fade, the whole walk drifting slow and grey.$$,
  seo_blurb       = $$Misty forest hush to settle a dog that paces alone$$
WHERE id = $$128-d-hdr-dibden-fog$$;
UPDATE public.projects SET
  seo_title       = $$Autumn Forest Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-autumn-forest-walk$$,
  seo_description = $$Leaf litter crunches underfoot for a watching dog as amber and russet leaves drift down through the autumn wood. For a dog unsettled at home, this slow walk past mossy beech trunks offers a steadying place to rest.$$,
  seo_blurb       = $$Autumn beech wood, falling leaves, calm for a tense dog$$
WHERE id = $$131-d-hdr-denny-wood$$;
UPDATE public.projects SET
  seo_title       = $$Frosty Virtual Dog Walk in Ancient Woodland — Dog TV$$,
  seo_slug        = $$dog-tv-frosty-virtual-walk-ancient-woodland$$,
  seo_description = $$Frost silvers the bracken and bare oak branches on this slow ancient-woodland walk, a gentle scene for an anxious dog. A home-alone dog can sink into the stillness as the path crunches gently over frozen leaf litter.$$,
  seo_blurb       = $$Frosted ancient woodland to quiet a home-alone dog$$
WHERE id = $$250103-d-hdr-dibden-inclosure-frost$$;
UPDATE public.projects SET
  seo_title       = $$Winter Coastal Dog Walk by the Sea — Dog TV$$,
  seo_slug        = $$dog-tv-winter-coastal-walk-sea$$,
  seo_description = $$For a dog left home alone, gentle waves fold over the shingle as sea air drifts along a quiet winter shore. For an anxious dog, the steady wash of the tide and the wide grey horizon make a calming place to settle.$$,
  seo_blurb       = $$Quiet winter shore and gentle waves for an anxious dog$$
WHERE id = $$250110-d-hdr-lepe$$;
UPDATE public.projects SET
  seo_title       = $$Snowy Finnish Forest Walk — Dog TV$$,
  seo_slug        = $$dog-tv-snowy-finnish-forest-walk$$,
  seo_description = $$Snow muffles the deep Finnish pine forest for a settling dog, its laden boughs heavy and the trail white and silent. A restless dog can wind down to this hushed Nordic walk through the cold.$$,
  seo_blurb       = $$Snowy Finnish pines, hushed and white, for a tense dog$$
WHERE id = $$250220-d-hdr-finland-forest-snow$$;
UPDATE public.projects SET
  seo_title       = $$Dawn Chorus Woodland — Calming Dog TV$$,
  seo_slug        = $$dog-tv-dawn-chorus-woodland-calming$$,
  seo_description = $$At first light the dawn chorus rises through the fog, a soft soothing path for a home-alone dog as the grey lifts. A dog left alone can settle to the gentle waking of the heath and its slow, drifting mist.$$,
  seo_blurb       = $$Foggy dawn chorus to ease a dog through a long morning$$
WHERE id = $$250327-a-hdr-kings-hat-fog$$;
UPDATE public.projects SET
  seo_title       = $$Heathland Birdsong — Calming Dog TV$$,
  seo_slug        = $$dog-tv-heathland-birdsong-calming$$,
  seo_description = $$Birdsong rings across the sunlit heath, gorse glowing gold — a warm, easy scene for a dog home alone. For a dog home alone, this slow, warm walk and its layered birdcalls make an easy place to rest.$$,
  seo_blurb       = $$Sunny heath birdsong for a dog left home alone$$
WHERE id = $$250330-a-hdr-kings-hat-sunny$$;
UPDATE public.projects SET
  seo_title       = $$Ponies on the Heath — Calming Dog TV$$,
  seo_slug        = $$dog-tv-ponies-heath-calming$$,
  seo_description = $$Ponies graze the heath beyond the woodland edge while a calming walk for an anxious dog threads past oak and bracken. An anxious dog can let its breathing slow to the unhurried pace and the soft natural sound.$$,
  seo_blurb       = $$Heath ponies past the oaks to calm an anxious dog$$
WHERE id = $$250405-a-hdr-denny-wood-woodland$$;
UPDATE public.projects SET
  seo_title       = $$Forest Stream — Calming Dog TV$$,
  seo_slug        = $$dog-tv-forest-stream-calming$$,
  seo_description = $$A shallow forest stream chatters over stones beside the path, its steady trickle easing a restless dog. Ferns crowd the banks and dappled light catches the moving water on this slow, gentle walk.$$,
  seo_blurb       = $$Babbling forest stream to soothe a restless dog$$
WHERE id = $$250410-a-hdr-darkwater-roadside$$;
UPDATE public.projects SET
  seo_title       = $$Spring Forest Stream — Calming Dog TV$$,
  seo_slug        = $$dog-tv-spring-forest-stream-calming$$,
  seo_description = $$Spring unfurls along a forest stream, a steady, settling scene for a dog that frets when left alone. For a dog that frets when alone, the soft flow and birdsong make a steady, settling backdrop.$$,
  seo_blurb       = $$Spring stream and new ferns for a dog who frets alone$$
WHERE id = $$250410-a-hdr-darkwater-woodland$$;
UPDATE public.projects SET
  seo_title       = $$Morning Dawn Chorus Woodland — Calming Dog TV$$,
  seo_slug        = $$dog-tv-morning-dawn-chorus-woodland-calming$$,
  seo_description = $$Soothing dog TV: bluebells spill across the woodland floor as the dawn chorus swells through the trees at first light. A home-alone dog can ease into the morning calm of this slow walk among oak and birch.$$,
  seo_blurb       = $$Bluebell wood at dawn chorus to settle a lonely dog$$
WHERE id = $$250430-a-hdr-bluebell-woods$$;
UPDATE public.projects SET
  seo_title       = $$Spring Dawn Chorus Woodland — Calming Dog TV$$,
  seo_slug        = $$dog-tv-spring-dawn-chorus-woodland-calming$$,
  seo_description = $$Mist lifts off the spring woodland as the dawn chorus swells through oak and beech, gentle company for a lonely dog. Soft early light filters down to mossy ground, a slow steady walk to settle an anxious dog. Real footage, streaming day and night.$$,
  seo_blurb       = $$Spring dawn light and birdsong to soothe a restless dog$$
WHERE id = $$250502-a-hdr-pig-bush$$;
UPDATE public.projects SET
  seo_title       = $$May Dawn Chorus Woodland — Calming Dog TV$$,
  seo_slug        = $$dog-tv-may-dawn-chorus-woodland-calming$$,
  seo_description = $$Cool May morning air hangs under the canopy for a restful dog, blackbird and robin song rising as the sun climbs. This gentle woodland stroll moves at a slow, calming pace for a dog left home alone.$$,
  seo_blurb       = $$May morning birdsong under a waking green canopy$$
WHERE id = $$250510-a-hdr-denny-wood$$;
UPDATE public.projects SET
  seo_title       = $$Wild Ponies Grazing — Dog TV$$,
  seo_slug        = $$dog-tv-wild-ponies-grazing$$,
  seo_description = $$Low golden light spills across the heath where wild ponies graze — a quiet view to settle a restless dog. The slow, even walk and grazing herd give an unsettled dog something quiet to settle beside.$$,
  seo_blurb       = $$Soft heath light and grazing ponies for a calmer dog$$
WHERE id = $$250519-a-hdr-fawley-inclosure-ponies$$;
UPDATE public.projects SET
  seo_title       = $$Spring Ponies in the Gorse — Calming Dog TV$$,
  seo_slug        = $$dog-tv-spring-ponies-gorse-calming$$,
  seo_description = $$Calming dog TV: spring sun warms the gorse, its yellow flower bright against fresh green as ponies graze near the water. A slow, steady amble to ease a restless or home-alone dog. On 24/7.$$,
  seo_blurb       = $$Bright spring gorse and grazing ponies, calm and slow$$
WHERE id = $$250525-a-hdr-moonhills-pond$$;
UPDATE public.projects SET
  seo_title       = $$Windy Ponies & Foals on the Heath — Dog TV$$,
  seo_slug        = $$dog-tv-windy-ponies-foals-heath$$,
  seo_description = $$For an anxious dog, wind ripples through the heather and bracken as ponies and their foals stand out on the open heath. The breezy, rolling scene keeps a steady, calming rhythm.$$,
  seo_blurb       = $$Breezy heath, ponies and foals to settle a dog$$
WHERE id = $$250526-a-hdr-rans-wood-windy$$;
UPDATE public.projects SET
  seo_title       = $$Dog TV Forest Walk — Ponies on the Heath$$,
  seo_slug        = $$dog-tv-forest-walk-ponies-heath$$,
  seo_description = $$Hazy afternoon light settles over the open heath where ponies graze, a gentle scene for an anxious dog. A slow walk, gentle and unhurried, to relax into. Real footage, always on.$$,
  seo_blurb       = $$Hazy heath afternoon and roaming ponies, slow and calm$$
WHERE id = $$250529-a-hdr-pig-bush-ponies$$;
UPDATE public.projects SET
  seo_title       = $$Heathland Ponies in the Gorse — Calming Dog TV$$,
  seo_slug        = $$dog-tv-heathland-ponies-gorse-calming$$,
  seo_description = $$For a dog left home alone, warm summer light pools over the gorse as a herd of ponies grazes the heathland. The calm, even pace is made to settle a restless dog.$$,
  seo_blurb       = $$Warm summer heath and grazing ponies, gentle and slow$$
WHERE id = $$250602-a-hdr-fawley-inclosure-ponies$$;
UPDATE public.projects SET
  seo_title       = $$Summer Ponies in the Gorse — Calming Dog TV$$,
  seo_slug        = $$dog-tv-summer-ponies-gorse-calming$$,
  seo_description = $$Summer haze hangs over the gorse, ponies drifting slowly through the yellow bloom and heather — a soothing walk for a home-alone dog to unwind to.$$,
  seo_blurb       = $$Summer gorse haze and slow ponies for an anxious dog$$
WHERE id = $$250602-a-hdr-moonhills-ponies$$;
UPDATE public.projects SET
  seo_title       = $$Ponies & Cattle on the Heath — Dog TV$$,
  seo_slug        = $$dog-tv-ponies-cattle-heath$$,
  seo_description = $$A calm scene for a restless dog: golden-hour light rakes low across the heath, warming ponies and cattle as they graze. The unhurried evening pace settles. Streams day and night.$$,
  seo_blurb       = $$Golden evening light, ponies and cattle on the heath$$
WHERE id = $$250604-a-hdr-kings-hat-golden-hour$$;
UPDATE public.projects SET
  seo_title       = $$Misty Heath Walk — Calming Dog TV$$,
  seo_slug        = $$dog-tv-misty-heath-walk-calming$$,
  seo_description = $$Thick morning mist drapes the heath, softening gorse and bracken into pale grey shapes, gentle company for an anxious dog at home. The slow, hushed walk soothes through the fog.$$,
  seo_blurb       = $$Soft morning mist over the heath, hushed and calming$$
WHERE id = $$250611-a-hdr-dibden-inclosure-misty$$;
UPDATE public.projects SET
  seo_title       = $$Sunrise on the Heath — Calming Dog TV$$,
  seo_slug        = $$dog-tv-sunrise-heath-calming$$,
  seo_description = $$To ease a home-alone dog into the day, first light breaks over the heath, sun catching dew on the bracken and the still wetland pools. A slow sunrise walk, steady and quiet.$$,
  seo_blurb       = $$Dewy sunrise over heath and still pools, slow and calm$$
WHERE id = $$250616-a-hdr-pig-bush-wetland$$;
UPDATE public.projects SET
  seo_title       = $$Evening Ponies & Cattle on the Heath — Dog TV$$,
  seo_slug        = $$dog-tv-evening-ponies-cattle-heath$$,
  seo_description = $$Warm evening sun slants gold across the heath as ponies and cattle graze, helping a restless dog wind down at the close of day. The slow, easy pace settles. Always on.$$,
  seo_blurb       = $$Warm evening sun, grazing ponies and cattle to calm a dog$$
WHERE id = $$250617-a-hdr-moonhills-sunny-evening$$;
UPDATE public.projects SET
  seo_title       = $$Sunny Sunrise on the Heath — Calming Dog TV$$,
  seo_slug        = $$dog-tv-sunny-sunrise-heath-calming$$,
  seo_description = $$Sunrise floods the open heath with clear bright light for an anxious dog to settle to, the air still and warm after dawn. This slow, gentle, sunlit walk calms.$$,
  seo_blurb       = $$Bright sunny sunrise over the heath, calm and slow$$
WHERE id = $$250619-a-hdr-hatchet-pond-sunrise$$;
UPDATE public.projects SET
  seo_title       = $$Windy Dog TV Forest Walk — Ponies on the Heath$$,
  seo_slug        = $$dog-tv-windy-forest-walk-ponies-heath$$,
  seo_description = $$A fresh breeze moves through the gorse and grass as ponies graze the open heath, a calming rhythm for a dog left alone. The rolling, windswept walk stays slow. Real footage.$$,
  seo_blurb       = $$Breezy heath walk and grazing ponies, slow and soothing$$
WHERE id = $$250622-a-hdr-fawley-inclosure-breezy$$;
UPDATE public.projects SET
  seo_title       = $$Sunny Forest Walk — Dog TV$$,
  seo_slug        = $$dog-tv-sunny-forest-walk$$,
  seo_description = $$Gentle company for a restless or home-alone dog, bright summer sun pours through the canopy, dappling the leaf litter along a quiet woodland path. The slow, sunlit walk soothes.$$,
  seo_blurb       = $$Sunny dappled woodland path, slow and calming$$
WHERE id = $$250704-a-hdr-pig-bush-sunny$$;
UPDATE public.projects SET
  seo_title       = $$Sunny Forest Stream — Calming Dog TV$$,
  seo_slug        = $$dog-tv-sunny-forest-stream-calming$$,
  seo_description = $$Summer light dances on a shallow forest stream, a quiet scene for an anxious dog to relax into as water slips over stones beneath the trees. The soft pace soothes.$$,
  seo_blurb       = $$Sunlit forest stream, gentle water for a calmer dog$$
WHERE id = $$250712-a-hdr-kings-hat-river$$;
UPDATE public.projects SET
  seo_title       = $$Summer Virtual Dog Walk in Ancient Woodland — Dog TV$$,
  seo_slug        = $$dog-tv-summer-virtual-walk-ancient-woodland$$,
  seo_description = $$Dog TV for an anxious or home-alone dog: wander beneath ancient oaks and beeches in full summer leaf, dappled light shifting across the mossy floor. The slow, steady pace settles. Real footage, on 24/7.$$,
  seo_blurb       = $$Steady summer stroll under old oaks to settle an anxious dog$$
WHERE id = $$250728-d-hdr-denny-wood$$;
UPDATE public.projects SET
  seo_title       = $$Summer Nature Walk for Dogs — Dog TV$$,
  seo_slug        = $$dog-tv-summer-nature-walk-dogs$$,
  seo_description = $$For a dog left alone, this unhurried summer ramble drifts through warm woodland with soft birdsong and green light overhead. Ferns and bracken sway as the path winds slowly on.$$,
  seo_blurb       = $$Slow summer woodland walk to keep a lonely dog calm$$
WHERE id = $$250802-d-hdr-pig-bush$$;
UPDATE public.projects SET
  seo_title       = $$Evening Sunrise on the Heath — Calming Dog TV$$,
  seo_slug        = $$dog-tv-evening-sunrise-heath-calming$$,
  seo_description = $$Calming dog TV as the sun lifts over open heath, free-roaming ponies grazing among the gorse in the soft evening glow. The calm, glowing horizon helps a restless dog wind down and rest.$$,
  seo_blurb       = $$Sunrise heath with grazing ponies for a restless dog$$
WHERE id = $$250803-a-hdr-moonhills-ponies$$;
UPDATE public.projects SET
  seo_title       = $$Dog TV: Summer Forest Walk$$,
  seo_slug        = $$dog-tv-summer-forest-walk$$,
  seo_description = $$For an anxious dog at home, a summer forest trail moves gently past silver birch and leaf litter under a high green canopy. The easy rhythm encourages it to lie down and breathe.$$,
  seo_blurb       = $$Easy summer forest path to soothe a nervy dog$$
WHERE id = $$250804-d-hdr-rans-wood$$;
UPDATE public.projects SET
  seo_title       = $$Summer Forest Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-summer-forest$$,
  seo_description = $$Purple heather and golden gorse stretch across sunlit open heath, a slow, grounding scene for a home-alone dog to relax into. The summer breeze stirs the low scrub.$$,
  seo_blurb       = $$Heather-covered heath in summer sun for a calm dog$$
WHERE id = $$250810-d-hdr-kings-hat-heather$$;
UPDATE public.projects SET
  seo_title       = $$Heathland Virtual Dog Walk in Ancient Woodland — Dog TV$$,
  seo_slug        = $$dog-tv-heathland-virtual-walk-ancient-woodland$$,
  seo_description = $$A patient walk crosses from open heathland into ancient woodland, ideal company for a dog that frets when alone. It threads between gnarled oaks, holly and bracken at a settling pace.$$,
  seo_blurb       = $$Heath-to-woodland walk to settle a fretful dog$$
WHERE id = $$250815-d-hdr-dibden-inclosure$$;
UPDATE public.projects SET
  seo_title       = $$Sunny Wild Ponies Grazing — Dog TV$$,
  seo_slug        = $$dog-tv-sunny-wild-ponies-grazing$$,
  seo_description = $$Under bright sun, wild ponies and their foals graze quietly across the grassland, giving a tense dog something soft and steady to watch. Their tails flick in the warm air.$$,
  seo_blurb       = $$Sunlit ponies and foals grazing to calm a tense dog$$
WHERE id = $$250905-d-hdr-denny-wood$$;
UPDATE public.projects SET
  seo_title       = $$Autumn Woodland Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-autumn-woodland-walk$$,
  seo_description = $$Amber and russet leaves drift through cool autumn woodland, a slow seasonal walk that helps an anxious dog rest at home. The trail crunches softly underfoot. Streams day and night.$$,
  seo_blurb       = $$Crisp autumn leaf-fall walk for an anxious dog$$
WHERE id = $$251006-d-hdr-fawley-inclosure$$;
UPDATE public.projects SET
  seo_title       = $$Snowy Woodland Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-snowy-woodland-walk$$,
  seo_description = $$Snow blankets the silent woodland and muffles each footstep, a hushed winter scene that gives a home-alone dog a peaceful place to curl up. Soft branches frame the white path.$$,
  seo_blurb       = $$Hushed snowy woods to comfort a lonely dog$$
WHERE id = $$260105-d-hdr-pig-bush$$;
UPDATE public.projects SET
  seo_title       = $$Winter Forest Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-winter-forest-walk$$,
  seo_description = $$Frost clings to bare trees as a winter forest trail winds slowly through pale light, its stillness made to help a restless dog rest. The quiet runs deep.$$,
  seo_blurb       = $$Frosty winter forest to ease a restless dog$$
WHERE id = $$260120-d-hdr-shatterford$$;
UPDATE public.projects SET
  seo_title       = $$Rainy Forest Walk for Dogs — Dog TV$$,
  seo_slug        = $$dog-tv-rainy-forest-walk-dogs$$,
  seo_description = $$Soft rain patters through the forest canopy, beading on ferns along the path to soothe an anxious dog left at home. The steady drizzle keeps the pace slow and gentle.$$,
  seo_blurb       = $$Rain-soaked forest sounds to calm an anxious dog$$
WHERE id = $$260218-w-sdr-dibden-inclosure-rain$$;
UPDATE public.projects SET
  seo_title       = $$Morning Rainy Forest Walk for Dogs — Dog TV$$,
  seo_slug        = $$dog-tv-morning-rainy-forest-walk-dogs$$,
  seo_description = $$A quiet, damp scene to help a home-alone dog stay settled. Early morning rain drifts across the waking forest, droplets sliding from leaf to leaf as the trail moves gently on.$$,
  seo_blurb       = $$Misty morning rain walk to settle a dog at home$$
WHERE id = $$260301-w-sdr-pig-bush-rain$$;
UPDATE public.projects SET
  seo_title       = $$Spring Misty Forest Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-spring-misty-forest-walk$$,
  seo_description = $$Spring mist hangs low between the trees, a dreamy, slow fog that gives a nervous dog a calming view to rest beside. The woodland softens into grey shapes as the path eases forward.$$,
  seo_blurb       = $$Foggy spring woodland to soothe a nervous dog$$
WHERE id = $$260309-w-hdr-dibden-inclosure-fog$$;
UPDATE public.projects SET
  seo_title       = $$Morning Dog TV: Calming Forest Walk$$,
  seo_slug        = $$dog-tv-morning-calming-forest-walk$$,
  seo_description = $$On a clear morning, light filters through fresh spring leaves as a gentle forest trail helps an anxious dog ease into calm at home. The path unwinds at an unhurried pace.$$,
  seo_blurb       = $$Clear morning forest walk to relax an anxious dog$$
WHERE id = $$260319-w-sdr-dibden-inclosure-clear$$;
UPDATE public.projects SET
  seo_title       = $$Sunny Calming Forest Dog Walk — Dog TV$$,
  seo_slug        = $$dog-tv-sunny-calming-forest$$,
  seo_description = $$Made for a restless dog that needs to wind down alone, a calming trail drifts slowly between sunlit spring trees as bright sun glints off new growth.$$,
  seo_blurb       = $$Sunny spring forest stroll to quiet a restless dog$$
WHERE id = $$260402-w-sdr-kings-hat-clear$$;
UPDATE public.projects SET
  seo_title       = $$Spring Virtual Dog Walk in Ancient Woodland — Dog TV$$,
  seo_slug        = $$dog-tv-spring-virtual-walk-ancient-woodland$$,
  seo_description = $$Spring breathes through ancient woodland, a soft, grounding scene for a home-alone dog to relax into. Bluebells and fresh ferns line the path beneath towering old oaks.$$,
  seo_blurb       = $$Springtime ancient woods to ground a lonely dog$$
WHERE id = $$260423-w-sdr-pig-bush-clear$$;

COMMIT;

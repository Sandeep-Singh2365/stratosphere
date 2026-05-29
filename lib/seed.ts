import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { sql } from './db';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Read admin credentials from environment (falling back to defaults if not loaded)
    const email = process.env.ADMIN_EMAIL || 'admin@stratosphere.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@1234';

    // Step 1: Insert admin user
    const passwordHash = await bcrypt.hash(password, 12);
    await sql`
      INSERT INTO users (email, password_hash, role)
      VALUES (${email}, ${passwordHash}, 'admin')
      ON CONFLICT (email) DO NOTHING
    `;
    console.log("Admin user seeded.");

    // Step 2: Insert 5 regions
    const regions = [
      { name: 'Indo-Pacific', slug: 'indo-pacific', color: '#3b82f6' },
      { name: 'Euro-Atlantic', slug: 'euro-atlantic', color: '#8b5cf6' },
      { name: 'Middle East & North Africa', slug: 'mena', color: '#f59e0b' },
      { name: 'Sub-Saharan Africa', slug: 'sub-saharan-africa', color: '#10b981' },
      { name: 'Latin America', slug: 'latin-america', color: '#ef4444' }
    ];

    for (const r of regions) {
      await sql`
        INSERT INTO regions (name, slug, color)
        VALUES (${r.name}, ${r.slug}, ${r.color})
        ON CONFLICT (slug) DO NOTHING
      `;
    }
    console.log("Regions seeded.");

    // Step 3: Insert 6 topics
    const topics = [
      { name: 'Geoeconomics', slug: 'geoeconomics', color: '#6366f1' },
      { name: 'Defense & Security', slug: 'defense-security', color: '#dc2626' },
      { name: 'Energy Policy', slug: 'energy-policy', color: '#d97706' },
      { name: 'Information Warfare', slug: 'information-warfare', color: '#7c3aed' },
      { name: 'Global Governance', slug: 'global-governance', color: '#059669' },
      { name: 'Maritime Security', slug: 'maritime-security', color: '#0284c7' }
    ];

    for (const t of topics) {
      await sql`
        INSERT INTO topics (name, slug, color)
        VALUES (${t.name}, ${t.slug}, ${t.color})
        ON CONFLICT (slug) DO NOTHING
      `;
    }
    console.log("Topics seeded.");

    // Step 4: Insert 3 analysts
    const analysts = [
      {
        name: "Dr. Priya Menon",
        slug: "priya-menon",
        title: "Senior Fellow, Indo-Pacific Security",
        bio: "Dr. Menon is a strategic affairs analyst specialising in maritime security, Quad dynamics, and India-ASEAN relations. She has advised multiple government bodies on Indo-Pacific policy."
      },
      {
        name: "Marcus Heller",
        slug: "marcus-heller",
        title: "Research Director, Euro-Atlantic Affairs",
        bio: "Marcus Heller tracks NATO expansion, European energy security, and the geopolitics of the Russia-Ukraine conflict. Former consultant to the European Council on Foreign Relations."
      },
      {
        name: "Aisha Okonkwo",
        slug: "aisha-okonkwo",
        title: "Fellow, African Strategic Studies",
        bio: "Aisha Okonkwo researches great power competition in Africa, resource geopolitics, and the political economy of the Sahel region."
      }
    ];

    for (const a of analysts) {
      await sql`
        INSERT INTO analysts (name, slug, title, bio)
        VALUES (${a.name}, ${a.slug}, ${a.title}, ${a.bio})
        ON CONFLICT (slug) DO NOTHING
      `;
    }
    console.log("Analysts seeded.");

    // Step 5: Fetch lookup IDs
    const dbRegions = await sql`SELECT id, slug FROM regions`;
    const dbTopics = await sql`SELECT id, slug FROM topics`;
    const dbAnalysts = await sql`SELECT id, slug FROM analysts`;

    const regionMap = new Map<string, string>();
    dbRegions.forEach((row: any) => regionMap.set(row.slug, row.id));

    const topicMap = new Map<string, string>();
    dbTopics.forEach((row: any) => topicMap.set(row.slug, row.id));

    const analystMap = new Map<string, string>();
    dbAnalysts.forEach((row: any) => analystMap.set(row.slug, row.id));

    // Step 6: Insert Articles
    const articlesData = [
      {
        title: "The Quad's New Momentum: Naval Exercises and the Battle for Indo-Pacific Influence",
        slug: "quad-momentum-naval-exercises-indo-pacific",
        section: "wire",
        content_type: "analysis",
        abstract: "Recent trilateral naval drills signal a strategic recalibration among Quad members as Chinese maritime assertiveness intensifies in the South China Sea.",
        analystSlug: "priya-menon",
        regions: ["indo-pacific"],
        topics: ["defense-security", "maritime-security"],
        is_featured: true,
        read_time: 6,
        content: `The recent joint naval maneuvers in the Philippine Sea mark a significant expansion of tactical interoperability among the Quadrilateral Security Dialogue nations. As maritime challenges in the region grow more complex, the coordinated deployment of surface combatants and anti-submarine warfare assets underscores a collective resolve. This security coordination serves as a direct message concerning the preservation of a free and open Indo-Pacific.

Strategic competition in the South China Sea has entered a new phase, characterized by persistent grey-zone activities and reinforced militarization of features. Quad members are seeking to counter these actions by offering alternative maritime domain awareness frameworks to Southeast Asian partners. By enhancing joint tracking capabilities, the coalition hopes to deter coercive actions without triggering escalatory kinetic conflicts.

However, internal dynamics within the Quad suggest differing thresholds for direct confrontation. While Washington advocates for more assertive patrol regimes, Delhi maintains a traditional focus on Indian Ocean stability, and Tokyo balances constitutional constraints. These strategic nuances require careful diplomatic negotiation to ensure that joint exercises translate into a cohesive regional deterrence policy.

Ultimately, the momentum of the Quad will depend on its ability to institutionalize security cooperation beyond periodic naval drills. Integrating supply chains, securing submarine telecommunication cables, and standardizing logistics sharing are critical steps. As the naval balance of power shifts, the capacity of the Quad to maintain maritime security will remain the cornerstone of Indo-Pacific stability.`
      },
      {
        title: "Europe's Energy Pivot: How the Continent Rewired Itself After the Gas Crisis",
        slug: "europe-energy-pivot-gas-crisis-rewiring",
        section: "wire",
        content_type: "analysis",
        abstract: "Three years after cutting Russian gas dependency, European states have accelerated LNG terminal construction and green hydrogen corridors at unprecedented speed.",
        analystSlug: "marcus-heller",
        regions: ["euro-atlantic"],
        topics: ["energy-policy", "geoeconomics"],
        is_featured: true,
        read_time: 7,
        content: `The swift redirection of European energy imports following the disruption of eastern pipeline flows represents one of the most rapid infrastructure transitions in modern history. Faced with severe winter supply shortfalls, European capitals quickly mobilized capital to build floating storage and regasification units (FSRUs). This emergency action successfully averted economic collapse and established new pipelines linking Western ports to the industrial core.

Beyond immediate fossil fuel alternatives, the crisis has catalyzed a structural shift toward decarbonization and sovereign energy generation. Significant investments are flowing into offshore wind grids in the North Sea and solar arrays across the Mediterranean. These clean energy projects are no longer viewed merely as climate mitigation strategies but as vital pillars of national security.

However, this energy pivot has not been without geopolitical friction and economic cost. The heavy reliance on global liquefied natural gas (LNG) markets has exposed European nations to high price volatility and intense competition with Asian buyers. Moreover, the transition relies heavily on imports of critical minerals and solar components, raising new dependencies on external processing chains.

In the long term, Europe's energy security will rely on deep regional integration and the realization of green hydrogen corridors. Developing domestic manufacturing capabilities for electrolyzers and battery storage is essential to break foreign monopolies. As the continent continues to rewire its energy architecture, the geopolitics of supply chains will shape Europe's strategic autonomy.`
      },
      {
        title: "Sahel in Flux: Wagner's Exit and the New Security Vacuum",
        slug: "sahel-flux-wagner-exit-security-vacuum",
        section: "wire",
        content_type: "analysis",
        abstract: "The retreat of Russian private military forces from Mali and Burkina Faso has created unpredictable realignments among regional jihadist factions and coup governments.",
        analystSlug: "aisha-okonkwo",
        regions: ["sub-saharan-africa"],
        topics: ["defense-security", "global-governance"],
        is_featured: false,
        read_time: 8,
        content: `The restructuring and partial withdrawal of Russian auxiliary security forces from the Sahel region has disrupted the fragile security frameworks established by local military administrations. For several years, these private military formations provided tactical support and regime protection in exchange for mining concessions. Their sudden retreat leaves military regimes in Bamako and Ouagadougou facing renewed insurgencies without adequate air support or intelligence capabilities.

Taking advantage of this retreat, jihadist coalitions affiliated with Al-Qaeda and Islamic State are intensifying operations across rural areas. The conflict is increasingly spilling southward toward the northern borders of littoral West African states, threatening regional trade hubs. Local militaries, weakened by internal purges and lack of international training, are struggling to hold territory.

The security vacuum is also inviting competing diplomatic interventions from regional powers and global actors. While neighboring states call for coordinated border patrols under renewed regional frameworks, military juntas are seeking alternative defense agreements. This fragmented response hinders the development of a unified counter-terrorism strategy and worsens the humanitarian situation.

Stabilizing the Sahel will require addressing the root causes of instability, including local governance failures and economic marginalization. Purely security-focused approaches have repeatedly failed to deliver lasting peace. Without building inclusive governance structures and restoring basic public services, the region will remain vulnerable to cycles of militancy and foreign intervention.`
      },
      {
        title: "BRICS at a Crossroads: Expansion, Fragmentation, and the Dollar Question",
        slug: "brics-crossroads-expansion-fragmentation-dollar",
        section: "wire",
        content_type: "analysis",
        abstract: "The admission of six new members to BRICS has exposed deep fault lines over reserve currency alternatives and the bloc's strategic coherence.",
        analystSlug: "priya-menon",
        regions: ["indo-pacific"],
        topics: ["geoeconomics", "global-governance"],
        is_featured: false,
        read_time: 5,
        content: `The expansion of the BRICS grouping to include new Middle Eastern and African economies marks a significant attempt to reshape global governance structures. Proponents argue that the enlarged bloc represents a larger share of global GDP and population, challenging Western-dominated financial institutions. However, this rapid enlargement risks diluting the group's decision-making consensus and amplifying internal rivalries.

A key point of contention is the push by some members to create alternative settlement mechanisms to bypass the US dollar. While nations subject to Western sanctions strongly advocate for rapid de-dollarization, other major economies favor a more cautious approach. Developing a unified BRICS currency remains a distant goal due to divergent monetary policies and capital controls.

Furthermore, geopolitical tensions between key members, particularly the border disputes between India and China, limit the bloc's strategic alignment. The inclusion of new members with complex bilateral relations adds another layer of diplomatic complexity. Resolving these internal differences is necessary if the group is to act as a cohesive force in international affairs.

Moving forward, BRICS must balance its geopolitical aspirations with economic realities. Strengthening the New Development Bank and expanding local currency swap agreements are practical steps toward financial diversification. Whether the expanded group can transform into a coherent multilateral institution or remain a loose political coalition will shape the future global order.`
      },
      {
        title: "Gaza Aftermath: Regional Order in the Post-Ceasefire Middle East",
        slug: "gaza-aftermath-regional-order-middle-east",
        section: "wire",
        content_type: "analysis",
        abstract: "The fragile ceasefire architecture is already straining under competing Iranian, Saudi, and Turkish visions for post-conflict Palestinian governance.",
        analystSlug: "marcus-heller",
        regions: ["mena"],
        topics: ["global-governance", "defense-security"],
        is_featured: false,
        read_time: 9,
        content: `The post-ceasefire landscape in the Levant is characterized by intense diplomatic maneuvering as regional powers compete to shape post-conflict governance. The destruction of infrastructure and displacement of population have created an urgent need for reconstruction funds and security stabilization. However, foreign assistance remains contingent on establishing a viable political roadmap that satisfies competing regional interests.

Saudi Arabia and its Gulf allies are pushing for a normalized security framework linked to concrete steps toward a two-state solution. In contrast, Iran continues to support its network of regional proxies, maintaining leverage over key transit routes and border areas. Meanwhile, Turkey seeks to position itself as a key mediator, leveraging its ties with various political factions to expand its regional influence.

These competing agendas complicate the deployment of any international peacekeeping force or transitional administration. Local actors remain suspicious of external mandates, while donor nations hesitate to commit billions without clear oversight mechanisms. The lack of a unified security concept increases the risk of local security breakdowns and renewed escalation.

Ultimately, a stable regional order requires reconciling the security needs of all parties with the governance aspirations of the local population. Regional normalization agreements cannot bypass the core issues of political representation and economic development. Without a comprehensive diplomatic framework, temporary ceasefires will only serve as interludes between future conflicts.`
      },
      {
        title: "Microchip Chokepoints: Taiwan, TSMC, and the Logic of Semiconductor Nationalism",
        slug: "microchip-chokepoints-taiwan-tsmc-semiconductor-nationalism",
        section: "wire",
        content_type: "analysis",
        abstract: "Washington and Beijing's competing semiconductor strategies have transformed chip fabs into the most strategically contested infrastructure on earth.",
        analystSlug: "priya-menon",
        regions: ["indo-pacific"],
        topics: ["geoeconomics", "information-warfare"],
        is_featured: false,
        read_time: 6,
        content: `The concentration of advanced semiconductor manufacturing in the Taiwan Strait has created a unique vulnerability in the global technology supply chain. High-end microchips are essential for everything from artificial intelligence to precision-guided munitions, making access to these components a national security priority. Consequently, the leading fabrication plants in Hsinchu are now major points of contention in the US-China strategic rivalry.

In response to this vulnerability, major powers are pursuing policies of semiconductor nationalism, investing billions to build domestic fabrication capacity. The US CHIPS Act and similar European programs aim to reduce reliance on East Asian supply chains by subsidizing local manufacturing facilities. However, replicating the complex ecosystem of suppliers, specialized chemicals, and skilled engineering talent will take years.

Beijing, meanwhile, is accelerating its drive for technological self-reliance by investing heavily in domestic toolmakers and legacy chip manufacturing. While export controls have slowed China's access to advanced lithography machines, they have also forced domestic firms to innovate. This technological decoupling is creating parallel supply chains with significant implications for global standards.

As chip manufacturing becomes increasingly politicized, the role of corporate actors like TSMC is under constant diplomatic pressure. Navigating conflicting regulatory regimes while maintaining technological leadership requires a delicate balance. The success of these diversification efforts will determine the stability of the global tech economy.`
      },
      {
        title: "Maritime Chokepoints and Great Power Competition: A Strategic Assessment for 2025-2035",
        slug: "maritime-chokepoints-great-power-competition-2025-2035",
        section: "institute",
        content_type: "paper",
        abstract: "This paper examines the strategic significance of the Strait of Malacca, Bab-el-Mandeb, and Hormuz corridor in the context of accelerating US-China naval competition and regional power realignments.",
        analystSlug: "priya-menon",
        regions: ["indo-pacific", "mena"],
        topics: ["maritime-security", "defense-security"],
        is_featured: true,
        read_time: 22,
        pdf_url: "/papers/maritime-chokepoints-2025.pdf",
        content: `The geography of global maritime trade is defined by narrow corridors that concentrate shipping lanes, making them critical nodes in international security. The Strait of Malacca, the Bab-el-Mandeb, and the Strait of Hormuz facilitate the movement of energy resources and manufactured goods between East Asia, the Middle East, and Europe. In an era of growing great power competition, these chokepoints are increasingly vulnerable to military blockades, asymmetric attacks, and state-sponsored piracy.

In the Indo-Pacific, the Malacca Strait represents a significant strategic vulnerability for energy-importing economies. The threat of a naval blockade has driven efforts to develop alternative overland transit routes and expand maritime security partnerships. At the same time, regional powers are building up their naval forces and establishing new outposts to monitor traffic through nearby waterways, increasing the density of military assets in these areas.

In the Middle East, the Bab-el-Mandeb and Hormuz corridors are subject to regional conflicts and asymmetric tactics. The deployment of low-cost anti-ship missiles and unmanned sea vehicles by non-state actors has shown the difficulty of protecting commercial shipping in confined waters. Protecting these lanes requires international naval coalitions, which are often complicated by competing geopolitical priorities among member states.

Over the next decade, securing these maritime chokepoints will require updated security frameworks and increased investment in maritime domain awareness. Developing remote detection capabilities, sharing tracking data, and standardizing rules of engagement for unmanned systems are essential tasks. As the naval balance of power evolves, the stability of global trade will depend on the collective capacity to keep these vital waterways open.`
      },
      {
        title: "The Green Transition as Geopolitical Instrument: Energy Policy in the Multipolar Era",
        slug: "green-transition-geopolitical-instrument-multipolar-era",
        section: "institute",
        content_type: "paper",
        abstract: "Renewable energy transitions are increasingly weaponised as instruments of statecraft, with critical mineral supply chains becoming the new oil chokepoints of the 21st century.",
        analystSlug: "marcus-heller",
        regions: ["euro-atlantic", "sub-saharan-africa"],
        topics: ["energy-policy", "geoeconomics"],
        is_featured: false,
        read_time: 18,
        pdf_url: "/papers/green-transition-geopolitics.pdf",
        content: `The global shift toward renewable energy is redrawing the map of geopolitical power, replacing traditional oil and gas dependencies with new resource dynamics. High-capacity batteries, wind turbines, and solar panels require steady supplies of critical minerals like lithium, cobalt, nickel, and rare earth elements. As a result, securing access to these mining and processing supply chains has become a primary objective of industrial and foreign policy.

Currently, a significant portion of critical mineral refining and processing is concentrated in a few countries, creating potential supply vulnerabilities for import-dependent nations. In response, Western economies are building new partnerships with resource-rich states, particularly in Sub-Saharan Africa and Latin America. These initiatives seek to counter existing monopolies by investing in local infrastructure and processing facilities.

However, this scramble for resources risks creating new forms of dependence and environmental challenges for host nations. African governments are increasingly demanding that foreign investments include local value-addition, rather than simple raw material extraction. This shift is driving updates to mining regulations and investment codes, challenging traditional concession models.

In the long term, a stable energy transition requires diversifying both extraction sites and refining capacity. Developing recycling technologies and alternative chemistries that reduce reliance on scarce materials are also important steps. As the green transition accelerates, energy security will be defined by the resilience and diversity of these new supply chains.`
      },
      {
        title: "Information Warfare and Democratic Resilience: Lessons from Three Conflict Zones",
        slug: "information-warfare-democratic-resilience-conflict-zones",
        section: "institute",
        content_type: "report",
        abstract: "A comparative analysis of Russian, Chinese, and non-state information operations across Ukraine, Taiwan, and the Sahel, evaluating democratic societies' adaptive capacity.",
        analystSlug: "marcus-heller",
        regions: ["euro-atlantic", "indo-pacific", "sub-saharan-africa"],
        topics: ["information-warfare", "global-governance"],
        is_featured: false,
        read_time: 25,
        content: `The integration of digital technologies into modern conflict has transformed the information space into an active domain of warfare. State and non-state actors deploy coordinated disinformation campaigns to influence public opinion, undermine trust in democratic institutions, and disrupt decision-making processes. Analyzing these operations in active conflict zones provides valuable lessons for building societal resilience against cognitive manipulation.

In Eastern Europe, information operations are closely coordinated with physical military actions, using cyber attacks and fabricated narratives to demoralize opponents. In the Asia-Pacific, campaigns focus on amplifying social divisions and undermining trust in democratic processes to influence political outcomes. In the Sahel, information operations exploit local grievances against international partners to build support for new political alignments.

Countering these operations is difficult because the tactics used often exploit the open nature of democratic societies. Traditional responses, such as fact-checking and content moderation, are often too slow to match the scale and speed of automated disinformation. Furthermore, government interventions must be carefully managed to avoid infringing on speech and press freedoms.

Building long-term resilience requires a multi-layered approach that goes beyond defensive measures. Promoting media literacy, supporting independent journalism, and improving coordination between government and private tech platforms are essential steps. By understanding the techniques of foreign information manipulation, democratic societies can better protect their public discourse.`
      },
      {
        title: "Africa's Mineral Wealth and the New Scramble: Governance Frameworks for Strategic Resource Competition",
        slug: "africa-mineral-wealth-new-scramble-governance",
        section: "institute",
        content_type: "brief",
        abstract: "As lithium, cobalt, and rare earth competition intensifies, African states are developing new sovereignty-asserting resource governance frameworks that challenge traditional extractive models.",
        analystSlug: "aisha-okonkwo",
        regions: ["sub-saharan-africa"],
        topics: ["geoeconomics", "global-governance"],
        is_featured: false,
        read_time: 14,
        content: `The rising global demand for strategic minerals has initiated a new wave of competition for access to Africa's mineral wealth. Major economies are seeking to secure supply agreements for materials essential to defense and green energy technologies. Unlike past resource rushes, however, African states are using their leverage to negotiate more favorable terms, seeking to move beyond raw material export to domestic industrialization.

Across the continent, governments are updating mining laws to mandate local processing, increase state participation, and improve environmental standards. These policies aim to capture a larger share of the value chain within domestic economies, creating jobs and supporting broader development. However, implementing these regulations requires balancing sovereignty with the need to attract foreign capital.

The competition is also leading to new dynamics as African states engage with multiple partners to secure the best terms. By avoiding exclusive agreements, countries can negotiate better infrastructure investments and technology transfer commitments. Still, navigating the competing interests of global powers requires strong national institutions and clear policy frameworks.

Ultimately, the long-term benefit of Africa's mineral wealth will depend on the quality of resource governance. Strengthening anti-corruption measures, ensuring transparent revenue management, and investing in human capital are critical tasks. By developing robust governance frameworks, African nations can ensure that strategic resource competition supports sustainable economic growth.`
      }
    ];

    for (const art of articlesData) {
      const analystId = analystMap.get(art.analystSlug);
      if (!analystId) {
        console.error(`Analyst ${art.analystSlug} not found in map.`);
        continue;
      }

      await sql`
        INSERT INTO articles (title, slug, abstract, content, section, content_type, analyst_id, is_published, is_featured, published_at, read_time, pdf_url)
        VALUES (
          ${art.title},
          ${art.slug},
          ${art.abstract},
          ${art.content},
          ${art.section},
          ${art.content_type || null},
          ${analystId},
          true,
          ${art.is_featured},
          NOW(),
          ${art.read_time},
          ${art.pdf_url || null}
        )
        ON CONFLICT (slug) DO NOTHING
      `;
    }
    console.log("Articles seeded.");

    // Step 6b: Populate Junctions
    const dbArticles = await sql`SELECT id, slug FROM articles`;
    const articleMap = new Map<string, string>();
    dbArticles.forEach((row: any) => articleMap.set(row.slug, row.id));

    for (const art of articlesData) {
      const articleId = articleMap.get(art.slug);
      if (!articleId) continue;

      // Seed article_regions
      for (const rSlug of art.regions) {
        const rId = regionMap.get(rSlug);
        if (rId) {
          await sql`
            INSERT INTO article_regions (article_id, region_id)
            VALUES (${articleId}, ${rId})
            ON CONFLICT (article_id, region_id) DO NOTHING
          `;
        }
      }

      // Seed article_topics
      for (const tSlug of art.topics) {
        const tId = topicMap.get(tSlug);
        if (tId) {
          await sql`
            INSERT INTO article_topics (article_id, topic_id)
            VALUES (${articleId}, ${tId})
            ON CONFLICT (article_id, topic_id) DO NOTHING
          `;
        }
      }
    }
    console.log("Junction tables seeded.");

    // Step 7: Log counts
    const usersCountRes = await sql`SELECT COUNT(*)::integer as count FROM users`;
    const regionsCountRes = await sql`SELECT COUNT(*)::integer as count FROM regions`;
    const topicsCountRes = await sql`SELECT COUNT(*)::integer as count FROM topics`;
    const analystsCountRes = await sql`SELECT COUNT(*)::integer as count FROM analysts`;
    const wireArticlesCountRes = await sql`SELECT COUNT(*)::integer as count FROM articles WHERE section = 'wire'`;
    const instArticlesCountRes = await sql`SELECT COUNT(*)::integer as count FROM articles WHERE section = 'institute'`;
    const totalArticlesCount = (wireArticlesCountRes[0]?.count || 0) + (instArticlesCountRes[0]?.count || 0);

    console.log("Seed complete:");
    console.log(`  Users: ${usersCountRes[0]?.count || 0}`);
    console.log(`  Regions: ${regionsCountRes[0]?.count || 0}`);
    console.log(`  Topics: ${topicsCountRes[0]?.count || 0}`);
    console.log(`  Analysts: ${analystsCountRes[0]?.count || 0}`);
    console.log(`  Articles: ${totalArticlesCount} (wire: ${wireArticlesCountRes[0]?.count || 0}, institute: ${instArticlesCountRes[0]?.count || 0})`);

  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();

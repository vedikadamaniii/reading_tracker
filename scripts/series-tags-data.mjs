// Series groupings identified by hand (Claude's own knowledge of these books),
// not from the Google Books API (which has no structured series field).
// Only high/medium-confidence series+order are included; ambiguous ones were
// deliberately left out — see the accompanying summary for what was skipped
// and why, so they can be filled in via the CSV workflow if desired.

export const seriesTags = [
  // Abby Jimenez — Part of Your World duology
  { id: '4f6e5844-9593-481f-81d5-b9d2dcbc5428', series_name: 'Part of Your World', series_order: 1 }, // Part Of Your World
  { id: '35e4a2d1-b22a-46c3-9921-18562c998ddb', series_name: 'Part of Your World', series_order: 2 }, // Yours Truly

  // Ally Carter — Heist Society
  { id: 'f0591ce6-921d-40ad-98b2-257723233fe8', series_name: 'Heist Society', series_order: 1 }, // Heist Society
  { id: '44927ccf-c4a6-4925-864a-c958742ec6a1', series_name: 'Heist Society', series_order: 2 }, // Uncommon Criminals
  { id: 'bef82405-55ce-4ec9-b560-2d9ffc614e2a', series_name: 'Heist Society', series_order: 3 }, // Perfect Scoundrels
  { id: '7b285f35-890e-4c9d-9439-6c22b63d713c', series_name: 'Heist Society', series_order: 4 }, // Grift Of The Magi
  { id: '3af59e78-5383-4f34-ab22-6206a8adb567', series_name: 'Heist Society', series_order: 5 }, // Double Crossed

  // Ana Huang — Kings of Sin
  { id: '2c063fe0-f172-4abf-8451-daef53583799', series_name: 'Kings of Sin', series_order: 1 }, // King Of Wrath
  { id: '4d38ce4d-5aa1-4f90-85af-51f9c1271036', series_name: 'Kings of Sin', series_order: 2 }, // King Of Pride
  { id: '6d1a679b-7cc6-4178-b412-d3c62fffcbd4', series_name: 'Kings of Sin', series_order: 3 }, // King Of Greed
  { id: 'c454bfb0-9d45-449f-8c52-4b4e05b96405', series_name: 'Kings of Sin', series_order: 4 }, // King Of Sloth
  { id: '1bf4eec0-391d-437b-b405-8c96f3c2dbad', series_name: 'Kings of Sin', series_order: 5 }, // King Of Envy
  { id: 'dcf731fa-f263-4557-82da-2d69f66b9a55', series_name: 'Kings of Sin', series_order: 6 }, // King Of Gluttony
  { id: '71c7215f-c765-4ed4-a5dd-9448c6b1e5c5', series_name: 'Kings of Sin', series_order: 7 }, // King Of Lust

  // Ana Huang — Twisted
  { id: '9eabf696-f082-41df-91dd-59cf6fa6c5ce', series_name: 'Twisted', series_order: 1 }, // Twisted Love
  { id: 'e9c1cee6-c912-4493-82a4-ed5436668e3c', series_name: 'Twisted', series_order: 2 }, // Twisted Games
  { id: 'e1338147-fc9d-4716-be09-2d6e8372e7a7', series_name: 'Twisted', series_order: 3 }, // Twisted Hate
  { id: 'c6ef2100-0e6a-4a78-888d-1b870e722bac', series_name: 'Twisted', series_order: 4 }, // Twisted Lies

  // Brynne Weaver — Ruthless Boys of the Zodiac
  { id: '12b9c4db-97ba-4f09-b192-3f7a4551df49', series_name: 'Ruthless Boys of the Zodiac', series_order: 1 }, // Butcher & Blackbird
  { id: 'b39adf70-f0cd-4f8c-a118-652356f95dc2', series_name: 'Ruthless Boys of the Zodiac', series_order: 2 }, // Scythe & Sparrow
  { id: 'ac84930a-2408-4dcd-aedc-6ed30ed5f681', series_name: 'Ruthless Boys of the Zodiac', series_order: 3 }, // Leather & Lark

  // Chloe Walsh — Boys of Tommen
  { id: '2ffa6e2d-21a2-4e39-af71-158957a2b5af', series_name: 'Boys of Tommen', series_order: 1 }, // Binding 13
  { id: 'e1bba654-3cd2-499f-972a-9a9c01daa1ca', series_name: 'Boys of Tommen', series_order: 2 }, // Saving 6
  { id: '4fd478f4-3985-44db-bda8-adf72cb635fb', series_name: 'Boys of Tommen', series_order: 3 }, // Keeping 13
  { id: '130635f5-2688-4159-9275-8d7d3c5c0947', series_name: 'Boys of Tommen', series_order: 4 }, // Redeeming 6
  { id: '4460662c-c470-40eb-a589-b0b5831ee4cc', series_name: 'Boys of Tommen', series_order: 5 }, // Taming 7
  { id: 'bfbe7092-bbc1-4714-b45f-0349d23f52fc', series_name: 'Boys of Tommen', series_order: 6 }, // Releasing 10

  // Elle Kennedy — Off-Campus
  { id: '9244beed-fcbf-4a05-ba96-ba3c6f6a8bd2', series_name: 'Off-Campus', series_order: 1 }, // The Deal
  { id: 'ff28697f-b20b-48f1-840f-72c535a94f64', series_name: 'Off-Campus', series_order: 2 }, // The Mistake
  { id: '34ac3fc0-babd-462d-92bf-f1074d85654b', series_name: 'Off-Campus', series_order: 3 }, // The Score
  { id: 'a0d49605-a2db-49f0-87c8-5f66423a7f01', series_name: 'Off-Campus', series_order: 4 }, // The Goal
  { id: 'f307bc19-79e5-43f0-a745-756741a8caae', series_name: 'Off-Campus', series_order: 5 }, // The Legacy

  // Elle Kennedy — Briar U (The Play deliberately excluded — unconfident on its placement)
  { id: '2e981e22-abc8-4489-a409-cdc74e481d50', series_name: 'Briar U', series_order: 1 }, // The Chase
  { id: '674d80c0-f892-49b9-a417-03f691735756', series_name: 'Briar U', series_order: 2 }, // The Risk (Elle Kennedy)
  { id: 'ecdeb784-82b8-499a-b352-c6485bcff934', series_name: 'Briar U', series_order: 3 }, // The Dare

  // Elsie Silver — Chestnut Springs (medium confidence on exact order)
  { id: 'd29fa2c6-dcff-4148-8a87-f52fb8e6070c', series_name: 'Chestnut Springs', series_order: 1 }, // Powerless
  { id: '68e988ef-6a13-4eef-86e8-2f57f9d15e12', series_name: 'Chestnut Springs', series_order: 2 }, // Flawless
  { id: 'd451655e-654f-4f8a-9f2d-55ba79fde105', series_name: 'Chestnut Springs', series_order: 3 }, // Heartless
  { id: '5d1b07b8-b129-455c-be9f-76f9d9492be3', series_name: 'Chestnut Springs', series_order: 4 }, // Reckless
  { id: 'cba8c511-0307-47a0-8c6e-c28fb2250e3a', series_name: 'Chestnut Springs', series_order: 5 }, // Hopeless

  // Holly Black — The Folk of the Air
  { id: 'c8f53371-8fc8-42ea-a6a0-ef5721389fa8', series_name: 'The Folk of the Air', series_order: 1 }, // The Cruel Prince
  { id: '62496aff-4a02-4e43-8e51-daab90e9f46b', series_name: 'The Folk of the Air', series_order: 2 }, // The Wicked King
  { id: '45af11b8-6716-4c26-9318-562c857c0a59', series_name: 'The Folk of the Air', series_order: 3 }, // The Queen of Nothing

  // J T Gessinger — Vicious Lost Boys (medium confidence)
  { id: 'b65f029c-2461-4efb-9f28-5647d139c0d1', series_name: 'Vicious Lost Boys', series_order: 1 }, // Ruthless Creatures
  { id: 'adabb2b0-3685-4752-9253-e759a1f0b70a', series_name: 'Vicious Lost Boys', series_order: 2 }, // Carnal Urges
  { id: 'c0283a09-6c17-4dcc-bbaa-f7b821ac4bd5', series_name: 'Vicious Lost Boys', series_order: 3 }, // Savage Hearts
  { id: 'a4419611-48dd-4678-9550-c4756e210bec', series_name: 'Vicious Lost Boys', series_order: 4 }, // Brutal Vows

  // Jenny Han — The Summer I Turned Pretty
  { id: 'b0fd3d2b-774b-4dcc-9abb-1b9b746a7479', series_name: 'The Summer I Turned Pretty', series_order: 1 }, // The Summer I Turned Pretty
  { id: '784f4c05-04c0-4797-8b95-c19023b15b69', series_name: 'The Summer I Turned Pretty', series_order: 2 }, // It's Not Summer Without You
  { id: 'be95bd3f-fc33-4504-b02d-edc0ad3fb16e', series_name: 'The Summer I Turned Pretty', series_order: 3 }, // We'll Always Have Summer

  // Jessa Hastings — Magnolia Parks Universe (medium-high confidence on order)
  { id: 'f054b275-a64f-4fee-8524-aba0e25926df', series_name: 'Magnolia Parks Universe', series_order: 1 }, // Magnolia Parks
  { id: 'c2e3fdbe-7f1c-488a-b115-97969ca7ddb0', series_name: 'Magnolia Parks Universe', series_order: 2 }, // Daisy Haites
  { id: '074c5d68-ecd1-429c-8182-a242eecc84ee', series_name: 'Magnolia Parks Universe', series_order: 3 }, // The Long Way Home
  { id: '3099b602-b69c-4fd9-95f7-aabcc633cdcf', series_name: 'Magnolia Parks Universe', series_order: 4 }, // The Great Undoing
  { id: 'bb55e606-f0c4-4555-8072-a1402af250c6', series_name: 'Magnolia Parks Universe', series_order: 5 }, // Into The Dark
  { id: '2ab0d5f9-c021-4807-9c38-e421767fa49f', series_name: 'Magnolia Parks Universe', series_order: 6 }, // The Conditions Of Will

  // Julia Quinn — Bridgertons
  { id: '205155a2-7852-43d4-96db-bcc25a547239', series_name: 'Bridgertons', series_order: 1 }, // The Duke And I
  { id: '5ba56398-1d4a-4074-bf7b-0db248b288cf', series_name: 'Bridgertons', series_order: 2 }, // The Viscount Who Loved Me
  { id: '70359381-ff0c-4d7b-84ab-e0064c85bf73', series_name: 'Bridgertons', series_order: 3 }, // An Offer From A Gentleman
  { id: 'ee0fb62d-6ea2-4f49-8420-22d07c650e48', series_name: 'Bridgertons', series_order: 4 }, // Romancing Mr. Bridgerton
  { id: '6ca3916c-ba01-4c35-8930-0226ea816bf7', series_name: 'Bridgertons', series_order: 5 }, // To Sir Philip With Love
  { id: 'cedde31f-2eed-4a57-9efd-f985c1c26bcb', series_name: 'Bridgertons', series_order: 6 }, // When He Was Wicked
  { id: 'caf4a93f-e7e7-4050-b08f-f3430fef3522', series_name: 'Bridgertons', series_order: 7 }, // It's In His Kiss
  { id: 'f4cec6ab-86a4-432d-9422-b801967df095', series_name: 'Bridgertons', series_order: 8 }, // On The Way To The Wedding

  // Katherine McGee — American Royals
  { id: 'fcb2dd3b-dff0-4acb-b53b-cf0b3a43c1f3', series_name: 'American Royals', series_order: 1 }, // American Royals
  { id: '94b8f446-d5a3-42cb-923b-01c9312410dc', series_name: 'American Royals', series_order: 2 }, // Majesty
  { id: 'd5ee582b-b8d7-4387-8d24-67f46b689ce4', series_name: 'American Royals', series_order: 3 }, // Rivals
  { id: '4d9123c1-b8ce-48a9-95e3-beef356f81b6', series_name: 'American Royals', series_order: 4 }, // Reign

  // Krista Ritchie — Addicted (medium confidence on full order)
  { id: 'ae7bd5ba-1b82-4bbb-8715-e9dad2da4249', series_name: 'Addicted', series_order: 1 }, // Addicted To You
  { id: 'bb019daa-4ad8-4c2f-9dcf-6f6e1eaae979', series_name: 'Addicted', series_order: 2 }, // Ricochet
  { id: '3475722f-6f00-48db-aeed-0869c4bf6641', series_name: 'Addicted', series_order: 3 }, // Addicted For Now
  { id: '2e7fce97-1415-4996-ba76-68076d411b3d', series_name: 'Addicted', series_order: 4 }, // Thrive
  { id: '7785e56a-a934-457d-87ff-46e8c8cd13e1', series_name: 'Addicted', series_order: 5 }, // Addicted After All
  { id: 'cb0bc24f-7f00-4a5d-aabc-da9a679a2412', series_name: 'Addicted', series_order: 6 }, // Kiss The Sky
  { id: 'a1a6a6a1-7576-4e5b-8433-f9fea9e38ed0', series_name: 'Addicted', series_order: 7 }, // Hothouse Flower
  { id: '2e9cf67e-865b-4967-8720-6e2b97e51da9', series_name: 'Addicted', series_order: 8 }, // Long Way Down
  { id: 'dab62ba9-409d-41a3-9d87-f80018f38d66', series_name: 'Addicted', series_order: 9 }, // Fuel The Fire
  { id: '0076da3b-b1d9-4a8b-bd0e-15ccdd9227fc', series_name: 'Addicted', series_order: 10 }, // Some Kind Of Perfect

  // Lauren Asher — Dreamland Billionaires
  { id: '7968ccb3-36e5-4ad6-a10a-7c3da265b54c', series_name: 'Dreamland Billionaires', series_order: 1 }, // The Fine Print
  { id: '81954572-4b69-4d8d-8a6d-2008ec601c3d', series_name: 'Dreamland Billionaires', series_order: 2 }, // Terms And Conditions
  { id: 'b615f6c3-c061-4fd7-90de-ee294ec8f04f', series_name: 'Dreamland Billionaires', series_order: 3 }, // Final Offer

  // Lauren Asher — Dirty Air (medium confidence on order)
  { id: '7b891daa-9d66-4613-b8ed-4970b1df914e', series_name: 'Dirty Air', series_order: 1 }, // Throttled
  { id: 'fc7962e6-f6b6-4d86-9844-db5f6d4c7a43', series_name: 'Dirty Air', series_order: 2 }, // Collided
  { id: '646a4acb-4512-43fa-8841-d6045d7c2c31', series_name: 'Dirty Air', series_order: 3 }, // Wrecked
  { id: 'a2ca2461-185a-48a7-9a38-564d2704b5d3', series_name: 'Dirty Air', series_order: 4 }, // Redeemed

  // Lauren Asher — Paradise
  { id: '18ac470d-bf93-4d69-9dd0-0aec98c74f3e', series_name: 'Paradise', series_order: 1 }, // Love Redesigned
  { id: '0c8d5762-1ac1-46f8-8d31-17d9f5c3395a', series_name: 'Paradise', series_order: 2 }, // Love Unwritten
  { id: '93a9cdb0-d2a7-45a9-8a53-94b161c42af4', series_name: 'Paradise', series_order: 3 }, // Love Arranged

  // Leigh Bardugo — Alex Stern
  { id: '20b77985-0f22-4740-80a8-7e4a60af0893', series_name: 'Alex Stern', series_order: 1 }, // Ninth House
  { id: 'bd67c90d-1ea2-4409-bf9c-d79f4e3b391f', series_name: 'Alex Stern', series_order: 2 }, // Hell Bent
  { id: '5c65b761-d951-4dd4-803d-1d843ceb572b', series_name: 'Alex Stern', series_order: 3 }, // Dead Beat

  // Liz Tomforde — Windy City (medium confidence on order)
  { id: '5d6bc738-aa9f-4855-bf2b-fafaf11ae9eb', series_name: 'Windy City', series_order: 1 }, // Mile High
  { id: '54bbda4f-d553-4c85-83d4-998d9148bee0', series_name: 'Windy City', series_order: 2 }, // The Right Move
  { id: 'd103216d-e966-4d81-8b61-3bdea9df9264', series_name: 'Windy City', series_order: 3 }, // Caught Up
  { id: '56eb27fd-8f07-4d9a-bfe2-51a9211408a2', series_name: 'Windy City', series_order: 4 }, // Play Along
  { id: '20dbc2e5-adb2-425c-af42-3781b488bd1c', series_name: 'Windy City', series_order: 5 }, // Rewind It Back
  { id: '9cd38800-4c9d-4cb8-8c5d-654128589111', series_name: 'Windy City', series_order: 6 }, // In Her Own League

  // Lynn Painter — Better Than the Movies (direct sequel pair; Fake Skating excluded, unrelated standalone)
  { id: 'f8d6ebcd-edd8-4df4-80b9-4ea4309fae9c', series_name: 'Better Than the Movies', series_order: 1 }, // Better Than The Movies
  { id: '2dce3019-ad98-4739-a803-5a7a46de499c', series_name: 'Better Than the Movies', series_order: 2 }, // Nothing Like The Movies

  // Naomi Novik — The Scholomance
  { id: '62a5aba7-ce7d-49b9-b5c6-255a795bcce0', series_name: 'The Scholomance', series_order: 1 }, // A Deadly Education
  { id: '03759cbc-a772-4018-b519-e761bd7c1e33', series_name: 'The Scholomance', series_order: 2 }, // The Last Graduate
  { id: '971c0789-2e35-469e-a7bd-82920aa4fc93', series_name: 'The Scholomance', series_order: 3 }, // The Golden Enclaves

  // Rebecca Yarros — The Empyrean
  { id: 'f2614773-98d2-4c42-a1df-8db13633dccc', series_name: 'The Empyrean', series_order: 1 }, // Fourth Wing
  { id: 'c4be9702-fa8f-49e6-bb6a-2251c3193b90', series_name: 'The Empyrean', series_order: 2 }, // Iron Flame
  { id: 'b2611fab-38f0-4810-a433-619cf9f5cc95', series_name: 'The Empyrean', series_order: 3 }, // Onyx Storm

  // Sarah Adams — When in Rome
  { id: 'd7fa08d0-5321-431c-92b0-9d65d2d0e70a', series_name: 'When in Rome', series_order: 1 }, // When In Rome
  { id: '5fcbbc3e-e92b-465a-ba0f-4e8860c6c5ea', series_name: 'When in Rome', series_order: 2 }, // Practice Makes Perfect

  // Sarah Adams — historical duology (medium confidence)
  { id: '20fea533-88de-45c4-8b1b-7ccc43d7ef9d', series_name: 'To Con a Gentleman', series_order: 1 }, // To Con A Gentleman
  { id: 'd6152748-431a-43ea-bf56-ed32a9ac7e88', series_name: 'To Con a Gentleman', series_order: 2 }, // To Catch A Suitor

  // Sarah Hawley — Glimmer Falls
  { id: '8915871a-6bab-4856-ba6d-ce1bc39fddb5', series_name: 'Glimmer Falls', series_order: 1 }, // A Witch's Guide To Fake Dating A Demon
  { id: 'bc6fc804-e533-483b-b3f0-503dd3c14014', series_name: 'Glimmer Falls', series_order: 2 }, // A Demon's Guide To Wooing A Witch
  { id: 'cef447db-6738-4d83-9a5e-29ea601eadae', series_name: 'Glimmer Falls', series_order: 3 }, // A Werewolf's Guide To Seducing A Vampire

  // Sarah J Maas — Throne of Glass
  { id: '050a1693-71cb-4f64-8ba8-e2aed1124104', series_name: 'Throne of Glass', series_order: 1 }, // Throne Of Glass
  { id: '6671b8bc-7499-4ae0-ae9d-64e6e0ae830a', series_name: 'Throne of Glass', series_order: 2 }, // Crown Of Midnight
  { id: '465bbe09-7b12-4571-94d6-fb0b874b7838', series_name: 'Throne of Glass', series_order: 3 }, // The Assassin's Blade
  { id: 'a7b6a627-1907-4347-9bcd-b050552cc4ff', series_name: 'Throne of Glass', series_order: 4 }, // Heir Of Fire
  { id: 'e3d4ca50-12fc-4cc0-902a-c3ee4079899e', series_name: 'Throne of Glass', series_order: 5 }, // Queen Of Shadows
  { id: '189c44ca-6747-4c07-aac4-cff2271b9ff4', series_name: 'Throne of Glass', series_order: 6 }, // Empire Of Storms
  { id: '1b9a31f1-9513-474f-abef-ef0515311917', series_name: 'Throne of Glass', series_order: 7 }, // Tower Of Dawn
  { id: '6e196956-7ebf-47b2-8156-0ba71393397f', series_name: 'Throne of Glass', series_order: 8 }, // Kingdom Of Ash

  // Sarah J Maas — Crescent City
  { id: '3a08d201-b6ed-4c0f-ae48-8bcf9d1d9314', series_name: 'Crescent City', series_order: 1 }, // House Of Earth & Blood
  { id: '5cc705f4-c666-4906-8635-80342ccda125', series_name: 'Crescent City', series_order: 2 }, // House Of Sky & Breath
  { id: 'bc7fee00-d6e4-44dd-8e1e-ce9c0cadc56d', series_name: 'Crescent City', series_order: 3 }, // House Of Flame & Shadow

  // Sarah J Maas — A Court of Thorns and Roses
  { id: 'fc04f32b-8154-46bd-929e-3adcd16ff07b', series_name: 'A Court of Thorns and Roses', series_order: 1 }, // (title will be corrected by the rename pass)
  { id: '2076f9b4-47bb-4dd5-be31-921b26916c65', series_name: 'A Court of Thorns and Roses', series_order: 2 }, // A Court Of Mist And Fury
  { id: '61f04417-93db-422d-8335-a034ad936178', series_name: 'A Court of Thorns and Roses', series_order: 3 }, // A Court Of Wings And Ruin
  { id: '7023ae4f-17c2-483b-ae23-85fde84676db', series_name: 'A Court of Thorns and Roses', series_order: 4 }, // A Court Of Frost And Starlight
  { id: '7d37a0fc-3101-4c6b-999c-1fb8a0d9efb7', series_name: 'A Court of Thorns and Roses', series_order: 5 }, // A Court Of Silver Flames

  // Stephanie Garber — Caraval
  { id: 'dfcd2a68-6634-470a-b776-737493b959cd', series_name: 'Caraval', series_order: 1 }, // Caraval
  { id: '018f7e5a-de6d-4ad3-95e2-8890c3828d9d', series_name: 'Caraval', series_order: 2 }, // Legendary
  { id: '1a840151-213f-4761-8dae-f83f3b007997', series_name: 'Caraval', series_order: 3 }, // Finale

  // Stephanie Garber — Once Upon a Broken Heart (Alchemy of Secrets placement is a guess)
  { id: '0c358127-621f-4b5b-8ff8-2c832a4f48cb', series_name: 'Once Upon a Broken Heart', series_order: 1 }, // Once Upon A Broken Heart
  { id: '6200a1f3-f03c-4f21-b3eb-554988c589ff', series_name: 'Once Upon a Broken Heart', series_order: 2 }, // The Ballad Of Never After
  { id: 'cb724b3f-d578-40f7-bc9b-edd9cedb3b0f', series_name: 'Once Upon a Broken Heart', series_order: 3 }, // A Curse For True Love
  { id: '6cef2f78-c5f4-453e-a648-b8825d1db117', series_name: 'Once Upon a Broken Heart', series_order: 4 }, // Spectacular
  { id: '2ce70c94-8f07-4215-b74d-3d3e976bc539', series_name: 'Once Upon a Broken Heart', series_order: 5 }, // Alchemy of Secrets

  // Sujata Massey — Perveen Mistry
  { id: '7e819844-f81e-4bd7-af91-acf72fe95a11', series_name: 'Perveen Mistry', series_order: 1 }, // The Widows Of Malabar Hill
  { id: '38488389-ac6a-4d3a-adc3-1094f227474d', series_name: 'Perveen Mistry', series_order: 2 }, // The Satapur Moonstone
  { id: '9a1d588d-01a6-4575-8c74-9471c1c5c71e', series_name: 'Perveen Mistry', series_order: 3 }, // The Bombay Prince
  { id: 'e8e6a037-a125-48ef-9598-899ad8c0b811', series_name: 'Perveen Mistry', series_order: 4 }, // The Mistress Of Bhatia House

  // Trisha Wolfe — Lovely... trilogy (Marrow excluded — likely unrelated)
  { id: '0f4f589a-a564-490c-b45a-7a76d34a4364', series_name: 'Lovely...', series_order: 1 }, // Lovely Bad Things
  { id: 'dc83674a-1cbc-4880-8d9e-c4b6853ec8a2', series_name: 'Lovely...', series_order: 2 }, // Lovely Wicked Things
  { id: '6a0896c0-7f5c-40ba-b8fb-1de910abecfd', series_name: 'Lovely...', series_order: 3 }, // Lovely Violent Things
]

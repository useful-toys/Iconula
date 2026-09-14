<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# MDR 0008: Dados dos nomes das figurinhas

## Status

Aceito

## Contexto

A Fase 17 acrescenta o nome do jogador/elemento a cada figurinha do catálogo; a decisão de exibição — nome em duas linhas na metade de baixo do cartão, prenomes em caixa normal e sobrenome em caixa alta; escudo e foto do time só com o código — é do [IDR 0047](../idr/0047-nomes-de-jogadores-nas-figurinhas.md), e exige o corte prenomes/sobrenome como dado. A primeira listagem de nomes chegou embutida naquele IDR incompleta e com erros — 44 de 48 seleções (faltavam RSA, SEN, SUI e TUR), buracos em QAT06, SCO04, TUN12 e SWE04/12/14/16, posições 15–20 do Paraguai com jogadores da Colômbia e duplicatas em NZL, PAN, POR e UZB — e foi removida. A fonte original do humano, re-provida em 2026-09-13, foi conferida contra esses pontos: 48/48 seleções, grupos idênticos ao catálogo, buracos preenchidos e duplicatas resolvidas — com o Paraguai trazendo primeiro 13 e depois, por posição, os 18 jogadores. Este registro descreve o nome das figurinhas: as listas confirmadas abaixo são a definição da qual `src/data/jogadores.js` é transcrito na Fase 17.

## Decisão

- **Arquivo**: o dado mora em `src/data/jogadores.js`, transcrito das listas abaixo e consumido só por `src/data/catalogo.js` (`expandirFigurinhas`); nenhum componente o importa direto — o catálogo continua a única fonte para o resto do app ([MDR 0006](0006-catalogo-estatico-embutido.md), [TDR 0010](../tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md)).
- **Forma**: três exportações — `jogadoresPorSelecao` (48 siglas → 18 jogadores, cada um como "Prenomes/Sobrenome"; sem barra, nome único), `jogadoresFWC` (20), `jogadoresCOC` (14).
- **Corte prenomes/sobrenome**: nas seleções, cada jogador é escrito como "Prenomes/Sobrenome" — prenomes inteiros antes da barra; depois dela, o sobrenome, composto ou não, partículas incluídas (van, de, ter, El, Ben, Abu, Mac, Le, St.). Jogador sem barra é nome único (exibido numa linha só, em caixa alta). Extras FIFA, Coca-Cola e as posições fixas não têm corte.
- **Mapeamento de posições**: nas seleções, figurinha 01 = "Escudo do time", 13 = "Foto do time", 02–12 = jogadores 1–11, 14–20 = jogadores 12–18; FWC indexa a partir de zero (`FWC00` → `jogadoresFWC[0]`), COC a partir de um.
- **Campos no catálogo**: cada figurinha expandida ganha `nome` e `nomeLinhas` ([MDR 0006](0006-catalogo-estatico-embutido.md)). `nome` é o texto completo, sem a barra de corte ("Gabriel Magalhães", "Alisson", "Escudo do time"). `nomeLinhas` é o par [prenomes, sobrenome] para jogador com corte, [nulo, nome] para nome único, e ausente (`null`) para nome sem corte — posições fixas, Extras FIFA e Coca-Cola, cuja barra, quando existe, é literal. A exibição usa `nomeLinhas` nos jogadores e `nome` nos Extras FIFA e na Coca-Cola; nas posições fixas das seleções o nome não é exibido, só entra no nome acessível, que usa `nome` em todas as figurinhas ([IDR 0047](../idr/0047-nomes-de-jogadores-nas-figurinhas.md)). O dado não muda: `nome` continua preenchido nas posições fixas.
- **Fonte**: fornecimento do humano (fonte original do álbum), provisto e confirmado em 2026-09-13 para as 48 seleções, os Extras FIFA e a Coca-Cola, e registrado nas listas abaixo; o complemento do Paraguai, provisto depois e chaveado por posição (PAR-1 a PAR-20), coincidiu com o mapeamento nas 15 primeiras posições e fechou a lacuna das 16–20. A divergência FWC10–19 se resolveu em favor da fonte: FWC09 é a Taça Jules Rimet (FIFA Museum) e FWC10–19 são dez pôsteres históricos de campeãs, de Uruguai 1950 a Argentina 2022 — a descrição "onze campeãs históricas, de Itália 1934 a 2022" na seção da Fase 14 do README do plano era imprecisa e foi corrigida.
- **Grafia**: as listas abaixo já trazem as correções óbvias e diacritics dos nomes de imprensa conhecida — Matt Freese; Édouard Mendy, Sadio Mané e Krépin Diatta; os 18 nomes da Turquia (Uğurcan Çakır, Mert Müldür, Zeki Çelik, Abdulkerim Bardakcı, Çağlar Soyuncü, Merih Demiral, Ferdi Kadıoğlu, Kaan Ayhan, İsmail Yüksek, Hakan Çalhanoğlu, Orkun Kökçü, Arda Güler, İrfan Can Kahveci, Yunus Akgün, Can Uzun, Barış Alper Yılmaz, Kerem Aktürkoğlu, Kenan Yıldız); José Sá, Rúben Dias, Rúben Neves e João Félix; Ricardo Rodríguez; Sebastián Cáceres, Mathías Olivera, Maxi Araújo e Ronald Araújo; Aïssa Laïdouni; Joško Gvardiol; Antonio Sanabria (a fonte do complemento traz "Antônio"); Mathías Villasanti e Damián Bobadilla seguem acentuados, como na provisão anterior. Nomes não reconhecidos foram confirmados com o humano antes de entrar, como escritos: Orlando Gill (PAR 3) e Van Valery (TUN 3). Corrigidos na revisão das Fases 11–17: Farès Chaïbi (ALG), Bathusi Aubaas e Iqraam Rayners (RSA).
- **Invariantes** (testes em `src/data/jogadores.test.js` e `catalogo.test.js`): 48 seleções com 18 jogadores cada; todo jogador de seleção com corte ("Prenomes/Sobrenome") ou nome único, e nenhum corte aplicado a FWC/COC — cujos nomes podem conter barra literal (FWC00, FWC02, FWC09, FWC19); nenhum nome vazio; nenhuma duplicata na mesma seção; 20 FWC e 14 COC; 48×18 + 48 + 48 + 20 + 14 = 994 figurinhas com nome — nenhuma lacuna.

### Listas confirmadas (provisão de 2026-09-13)

Jogadores por seleção na ordem 1–18 da fonte, escritos como "Prenomes/Sobrenome" (sem barra, nome único); o Paraguai chegou depois, chaveado por posição (PAR-1 a PAR-20), e coincide. O mapeamento acima os transforma nas figurinhas 02–12 e 14–20. Seleções em ordem alfabética de sigla, como no catálogo.

- **ALG**: Alexis/Guendouz, Ramy/Bensebaini, Youcef/Atal, Rayan/Aït-Nouri, Mohamed Amine/Tougai, Aïssa/Mandi, Ismael/Bennacer, Houssem/Aouar, Hicham/Boudaoui, Ramiz/Zerrouki, Nabil/Bentaleb, Farès/Chaïbi, Riyad/Mahrez, Said/Benrahma, Anis/Hadj Moussa, Amine/Gouiri, Baghdad/Bounedjah, Mohammed/Amoura
- **ARG**: Emiliano/Martínez, Nahuel/Molina, Cristian/Romero, Nicolás/Otamendi, Nicolás/Tagliafico, Leonardo/Balerdi, Enzo/Fernández, Alexis/Mac Allister, Rodrigo/De Paul, Exequiel/Palacios, Leandro/Paredes, Nico/Paz, Franco/Mastantuono, Nico/González, Lionel/Messi, Lautaro/Martínez, Julián/Álvarez, Giuliano/Simeone
- **AUS**: Mathew/Ryan, Joe/Gauci, Harry/Souttar, Alessandro/Circati, Jordan/Bos, Aziz/Behich, Cameron/Burgess, Lewis/Miller, Milos/Degenek, Jackson/Irvine, Riley/McGree, Aiden/O'Neill, Connor/Metcalfe, Patrick/Yazbek, Craig/Goodwin, Kusini/Yengi, Nestory/Irankunda, Mohamed/Touré
- **AUT**: Alexander/Schlager, Patrick/Pentz, David/Alaba, Kevin/Danso, Philipp/Lienhart, Stefan/Posch, Phillipp/Mwene, Alexander/Prass, Xaver/Schlager, Marcel/Sabitzer, Konrad/Laimer, Florian/Grillitsch, Nicolas/Seiwald, Romano/Schmid, Patrick/Wimmer, Christoph/Baumgartner, Michael/Gregoritsch, Marko/Arnautović
- **BEL**: Thibaut/Courtois, Arthur/Theate, Timothy/Castagne, Zeno/Debast, Brandon/Mechele, Maxim/De Cuyper, Thomas/Meunier, Youri/Tielemans, Amadou/Onana, Nicolas/Raskin, Alexis/Saelemaekers, Hans/Vanaken, Kevin/De Bruyne, Jérémy/Doku, Charles/De Ketelaere, Leandro/Trossard, Loïs/Openda, Romelu/Lukaku
- **BIH**: Nikola/Vasilj, Amar/Dedić, Sead/Kolašinac, Tarik/Muharemović, Nihad/Mujakić, Nikola/Katić, Amir/Hadžiahmetović, Benjamin/Tahirović, Armin/Gigović, Ivan/Šunjić, Ivan/Bašić, Dženis/Burnić, Esmir/Bajraktarević, Amar/Memić, Ermedin/Demirović, Edin/Džeko, Samed/Baždar, Haris/Tabaković
- **BRA**: Alisson, Bento, Marquinhos, Éder/Militão, Gabriel/Magalhães, Danilo, Wesley, Lucas/Paquetá, Casemiro, Bruno/Guimarães, Luiz/Henrique, Vinícius/Júnior, Rodrygo, João/Pedro, Matheus/Cunha, Gabriel/Martinelli, Raphinha, Estêvão
- **CAN**: Dayne/St. Clair, Alphonso/Davies, Alistair/Johnston, Samuel/Adekugbe, Richie/Laryea, Derek/Cornelius, Moïse/Bombito, Kamal/Miller, Stephen/Eustáquio, Ismaël/Koné, Jonathan/Osorio, Jacob/Shaffelburg, Mathieu/Choinière, Niko/Sigur, Tajon/Buchanan, Liam/Millar, Cyle/Larin, Jonathan/David
- **CIV**: Yahia/Fofana, Ghislain/Konan, Wilfried/Singo, Odilon/Kossounou, Evan/Ndicka, Willy/Boly, Emmanuel/Agbadou, Ousmane/Diomande, Franck/Kessié, Seko/Fofana, Ibrahim/Sangaré, Jean-Philippe/Gbamin, Amad/Diallo, Sébastien/Haller, Simon/Adingra, Yan/Diomande, Evann/Guessand, Oumar/Diakité
- **COD**: Lionel/Mpasi, Aaron/Wan-Bissaka, Axel/Tuanzebe, Arthur/Masuaku, Chancel/Mbemba, Joris/Kayembe, Charles/Pickel, Ngal'ayel/Mukau, Edo/Kayembe, Samuel/Moutoussamy, Noah/Sadiki, Théo/Bongonda, Meschack/Elia, Yoane/Wissa, Brian/Cipenga, Fiston/Mayele, Cédric/Bakambu, Nathanaël/Mbuku
- **COL**: Camilo/Vargas, David/Ospina, Dávinson/Sánchez, Yerry/Mina, Daniel/Muñoz, Johan/Mojica, Jhon/Lucumí, Santiago/Arias, Jefferson/Lerma, Kevin/Castaño, Richard/Ríos, James/Rodríguez, Juan Fernando/Quintero, Jorge/Carrascal, Jhon/Arias, Jhon/Córdoba, Luis/Suárez, Luis/Díaz
- **CPV**: Vozinha, Logan/Costa, Pico, Diney, Steven/Moreira, Wagner/Pina, João/Paulo, Yannick/Semedo, Kevin/Pina, Patrick/Andrade, Jamiro/Monteiro, Deroy/Duarte, Garry/Rodrigues, Jovane/Cabral, Ryan/Mendes, Dailon/Livramento, Willy/Semedo, Bebé
- **CRO**: Dominik/Livaković, Duje/Ćaleta-Car, Joško/Gvardiol, Josip/Stanišić, Luka/Vušković, Josip/Šutalo, Kristijan/Jakić, Luka/Modrić, Mateo/Kovačić, Martin/Baturina, Lovro/Majer, Mario/Pašalić, Petar/Sučić, Ivan/Perišić, Marco/Pašalić, Ante/Budimir, Andrej/Kramarić, Franjo/Ivanović
- **CUW**: Eloy/Room, Armando/Obispo, Sherel/Floranus, Jurien/Gaari, Joshua/Brenet, Roshon/Van Eijma, Shurandy/Sambo, Livano/Comenencia, Godfried/Roemeratoe, Juninho/Bacuna, Leandro/Bacuna, Tahith/Chong, Kenji/Gorré, Jearl/Margaritha, Jurgen/Locadia, Jeremy/Antonisse, Gervane/Kastaneer, Sontje/Hansen
- **CZE**: Matěj/Kovář, Jindřich/Staněk, Ladislav/Krejčí, Vladímir/Coufal, Jaroslav/Zelený, Tomáš/Holeš, David/Zima, Michal/Sadílek, Lukáš/Provod, Lukáš/Červ, Tomáš/Souček, Pavel/Šulc, Matěj/Vydra, Vasil/Kušej, Tomáš/Chorý, Václav/Černý, Adam/Hložek, Patrik/Schick
- **ECU**: Hernán/Galíndez, Gonzalo/Valle, Piero/Hincapié, Pervis/Estupiñán, Willian/Pacho, Ángelo/Preciado, Joel/Ordóñez, Moisés/Caicedo, Alan/Franco, Kendry/Páez, Pedro/Vite, John/Yeboah, Leonardo/Campana, Gonzalo/Plata, Nilson/Angulo, Alan/Minda, Kevin/Rodríguez, Enner/Valencia
- **EGY**: Mohamed/El Shenawy, Mohamed/Hany, Mohamed/Hamdy, Yasser/Ibrahim, Khaled/Sobhi, Ramy/Rabia, Hossam/Abdelmaguid, Ahmed/Fatouh, Marwan/Attia, Zizo, Hamdy/Fathy, Mohamed/Lasheen, Emam/Ashour, Osama/Faisal, Mohamed/Salah, Mostafa/Mohamed, Trezeguet, Omar/Marmoush
- **ENG**: Jordan/Pickford, John/Stones, Marc/Guéhi, Ezri/Konsa, Trent/Alexander-Arnold, Reece/James, Dan/Burn, Jordan/Henderson, Declan/Rice, Jude/Bellingham, Cole/Palmer, Morgan/Rogers, Anthony/Gordon, Phil/Foden, Bukayo/Saka, Harry/Kane, Marcus/Rashford, Ollie/Watkins
- **ESP**: Unai/Simón, Robin/Le Normand, Aymeric/Laporte, Dean/Huijsen, Pedro/Porro, Dani/Carvajal, Marc/Cucurella, Martín/Zubimendi, Rodri, Pedri, Fabián/Ruiz, Mikel/Merino, Lamine/Yamal, Dani/Olmo, Nico/Williams, Ferran/Torres, Álvaro/Morata, Mikel/Oyarzabal
- **FRA**: Mike/Maignan, Theo/Hernández, William/Saliba, Jules/Koundé, Ibrahima/Konaté, Dayot/Upamecano, Lucas/Digne, Aurélien/Tchouaméni, Eduardo/Camavinga, Manu/Koné, Adrien/Rabiot, Michael/Olise, Ousmane/Dembélé, Bradley/Barcola, Désiré/Doué, Kingsley/Coman, Hugo/Ekitike, Kylian/Mbappé
- **GER**: Marc-André/ter Stegen, Jonathan/Tah, David/Raum, Nico/Schlotterbeck, Antonio/Rüdiger, Waldemar/Anton, Ridle/Baku, Maximilian/Mittelstädt, Joshua/Kimmich, Florian/Wirtz, Felix/Nmecha, Leon/Goretzka, Jamal/Musiala, Serge/Gnabry, Kai/Havertz, Leroy/Sané, Karim/Adeyemi, Nick/Woltemade
- **GHA**: Lawrence/Ati Zigi, Tariq/Lamptey, Mohammed/Salisu, Alidu/Seidu, Alexander/Djiku, Gideon/Mensah, Caleb/Yirenkyi, Abdul Fatawu/Issahaku, Thomas/Partey, Salis/Abdul Samed, Kamaldeen/Sulemana, Mohammed/Kudus, Iñaki/Williams, Jordan/Ayew, André/Ayew, Joseph/Paintsil, Osman/Bukari, Antoine/Semenyo
- **HAI**: Johny/Placide, Carlens/Arcus, Martin/Expérience, Jean-Kevin/Duverne, Ricardo/Adé, Duke/Lacroix, Garven/Metusala, Hannes/Delcroix, Leverton/Pierre, Danley/Jean Jacques, Jean-Ricner/Bellegarde, Christopher/Attys, Derrick/Etienne Jr., Josué/Casimir, Ruben/Providence, Duckens/Nazon, Louicius/Deedson, Frantzdy/Pierrot
- **IRN**: Alireza/Beiranvand, Morteza/Pouraliganji, Ehsan/Hajsafi, Milad/Mohammadi, Shoja/Khalilzadeh, Ramin/Rezaeian, Hossein/Kanaani, Sadegh/Moharrami, Saleh/Hardani, Saeed/Ezatolahi, Saman/Ghoddos, Omid/Noorafkan, Roozbeh/Cheshmi, Mohammad/Mohebi, Sardar/Azmoun, Mehdi/Taremi, Alireza/Jahanbakhsh, Ali/Gholizadeh
- **IRQ**: Jalal/Hassan, Rebin/Sulaka, Hussein/Ali, Akam/Hashem, Merchas/Doski, Zaid/Tahseen, Manaf/Younis, Zidane/Iqbal, Amir/Al-Ammari, Ibrahim/Bayesh, Ali/Jasim, Youssef/Amyn, Aimar/Sher, Marko/Farji, Osama/Rashid, Ali/Al-Hamadi, Aymen/Hussein, Mohanad/Ali
- **JOR**: Yazeed/Abulaila, Ihsan/Haddad, Mohammad/Abu Hashish, Yazan/Al-Arab, Abdallah/Nasib, Saleem/Obaid, Mohammad/Abualnadi, Ibrahim/Saadeh, Nizar/Al-Rashdan, Noor/Al-Rawabdeh, Mohannad/Abu Taha, Amer/Jamous, Musa/Al-Taamari, Yazan/Al-Naimat, Mahmoud/Al-Mardi, Ali/Olwan, Mohammad/Abu Zrayq, Ibrahim/Sabra
- **JPN**: Zion/Suzuki, Henry Heroki/Mochizuki, Ayumu/Seko, Junnosuke/Suzuki, Shogo/Taniguchi, Tsuyoshi/Watanabe, Kaishu/Sano, Yuki/Soma, Ao/Tanaka, Daichi/Kamada, Takefusa/Kubo, Ritsu/Doan, Keito/Nakamura, Takumi/Minamino, Shuto/Machino, Junya/Ito, Koki/Ogawa, Ayase/Ueda
- **KOR**: Hyeon-woo/Jo, Seung-Gyu/Kim, Min-jae/Kim, Yu-min/Cho, Young-woo/Seol, Han-beom/Lee, Tae-seok/Lee, Myung-jae/Lee, Jae-sung/Lee, In-beom/Hwang, Kang-in/Lee, Seung-ho/Paik, Jens/Castrop, Dong-gyeong/Lee, Gue-sung/Cho, Heung-min/Son, Hee-chan/Hwang, Hyeon-Gyu/Oh
- **KSA**: Nawaf/Alaqidi, Abdulrahman/Al-Sanbi, Saud/Abdulhamid, Nawaf/Boushal, Jihad/Thakri, Moteb/Al-Harbi, Hassan/Altambakti, Musab/Aljuwayr, Ziyad/Aljohani, Abdullah/Alkhaibari, Nasser/Aldawsari, Saleh/Abu Alshamat, Marwan/Alsahafi, Salem/Aldawsari, Abdulrahman/Al-Aboud, Feras/Albrikan, Saleh/Alshehri, Abdullah/Al-Hamdan
- **MAR**: Yassine/Bounou, Munir/El Kajoui, Achraf/Hakimi, Noussair/Mazraoui, Nayef/Aguerd, Romain/Saïss, Jawad/El Yamiq, Adam/Masina, Sofyan/Amrabat, Azzedine/Ounahi, Eliesse/Ben Seghir, Bilal/El Khannouss, Ismael/Saibari, Youssef/En-Nesyri, Abde/Ezzalzouli, Soufiane/Rahimi, Brahim/Díaz, Ayoub/El Kaabi
- **MEX**: Luis/Malagón, Johan/Vásquez, Jorge/Sánchez, César/Montes, Jesús/Gallardo, Israel/Reyes, Diego/Lainez, Carlos/Rodríguez, Edson/Álvarez, Orbelín/Pineda, Marcel/Ruiz, Érick/Sánchez, Hirving/Lozano, Santiago/Giménez, Raúl/Jiménez, Alexis/Vega, Roberto/Alvarado, César/Huerta
- **NED**: Bart/Verbruggen, Virgil/van Dijk, Micky/van de Ven, Jurriën/Timber, Denzel/Dumfries, Nathan/Aké, Jeremie/Frimpong, Jan Paul/van Hecke, Tijjani/Reijnders, Ryan/Gravenberch, Teun/Koopmeiners, Frenkie/de Jong, Xavi/Simons, Justin/Kluivert, Memphis/Depay, Donyell/Malen, Wout/Weghorst, Cody/Gakpo
- **NOR**: Ørjan/Nyland, Julian/Ryerson, Leo/Østigård, Kristoffer/Ajer, Marcus/Holmgren Pedersen, David/Møller Wolfe, Torbjørn/Heggem, Morten/Thorsby, Martin/Ødegaard, Sander/Berge, Andreas/Schjelderup, Patrick/Berg, Erling/Haaland, Alexander/Sørloth, Aron/Dønnum, Jørgen/Strand Larsen, Antonio/Nusa, Oscar/Bobb
- **NZL**: Max/Crocombe-Payne, Alex/Paulsen, Michael/Boxall, Liberato/Cacace, Tim/Payne, Tyler/Bindon, Francis/de Vries, Finn/Surman, Joe/Bell, Sarpreet/Singh, Ryan/Thomas, Matthew/Garbett, Marko/Stamenić, Ben/Old, Chris/Wood, Elijah/Just, Callum/McCowatt, Kosta/Barbarouses
- **PAN**: Orlando/Mosquera, Luis/Mejía, Fidel/Escobar, Andrés/Andrade, Michael Amir/Murillo, Eric/Davis, José/Córdoba, César/Blackman, Cristian/Martínez, Aníbal/Godoy, Adalberto/Carrasquilla, Édgar/Bárcenas, Carlos/Harvey, Ismael/Díaz, José/Fajardo, Cecilio/Waterman, José Luis/Rodríguez, Alberto/Quintero
- **PAR**: Roberto/Fernández, Orlando/Gill, Gustavo/Gómez, Fabián/Balbuena, Juan José/Cáceres, Omar/Alderete, Junior/Alonso, Mathías/Villasanti, Diego/Gómez, Damián/Bobadilla, Andrés/Cubas, Matías/Galarza Fonda, Julio/Enciso, Alejandro/Romero Gamarra, Miguel/Almirón, Ramón/Sosa, Ángel/Romero, Antonio/Sanabria
- **POR**: Diogo/Costa, José/Sá, Rúben/Dias, João/Cancelo, Diogo/Dalot, Nuno/Mendes, Gonçalo/Inácio, Bernardo/Silva, Bruno/Fernandes, Rúben/Neves, Vitinha, João/Neves, Cristiano/Ronaldo, Francisco/Trincão, João/Félix, Gonçalo/Ramos, Pedro/Neto, Rafael/Leão
- **QAT**: Meshaal/Barsham, Sultan/Albrake, Lucas/Mendes, Homam/Ahmed, Boualem/Khoukhi, Pedro/Miguel, Tarek/Salman, Mohamed/Al-Mannai, Karim/Boudiaf, Assim/Madibo, Ahmed/Fatehi, Mohammed/Waad, Abdulaziz/Hatem, Hassan/Al-Haydos, Edmilson/Junior, Akram Hassan/Afif, Ahmed/Al Ganehi, Almoez/Ali
- **RSA**: Ronwen/Williams, Sipho/Chaine, Aubrey/Modiba, Samukele/Kabini, Mbekezeli/Mbokazi, Khulumani/Ndamane, Siyabonga/Ngezana, Khuliso/Mudau, Nkosinathi/Sibisi, Teboho/Mokoena, Thalente/Mbatha, Bathusi/Aubaas, Yaya/Sithole, Sipho/Mbule, Lyle/Foster, Iqraam/Rayners, Mohau/Nkota, Oswin/Appolis
- **SCO**: Angus/Gunn, Jack/Hendry, Kieran/Tierney, Aaron/Hickey, Andrew/Robertson, Scott/McKenna, John/Souttar, Anthony/Ralston, Grant/Hanley, Scott/McTominay, Billy/Gilmour, Lewis/Ferguson, Ryan/Christie, Kenny/McLean, John/McGinn, Lyndon/Dykes, Che/Adams, Ben/Gannon-Doak
- **SEN**: Édouard/Mendy, Yehvann/Diouf, Moussa/Niakhaté, Abdoulaye/Seck, Ismail/Jakobs, El Hadji Malick/Diouf, Kalidou/Koulibaly, Idrissa/Gana Gueye, Pape Matar/Sarr, Pape/Gueye, Habib/Diarra, Lamine/Camara, Sadio/Mané, Ismaïla/Sarr, Boulaye/Dia, Iliman/Ndiaye, Nicolas/Jackson, Krépin/Diatta
- **SUI**: Gregor/Kobel, Yvon/Mvogo, Manuel/Akanji, Ricardo/Rodríguez, Nico/Elvedi, Aurèle/Amenda, Silvan/Widmer, Granit/Xhaka, Denis/Zakaria, Remo/Freuler, Fabian/Rieder, Ardon/Jashari, Johan/Manzambi, Michel/Aebischer, Breel/Embolo, Ruben/Vargas, Dan/Ndoye, Zeki/Amdouni
- **SWE**: Victor/Johansson, Isak/Hien, Gabriel/Gudmundsson, Emil/Holm, Victor/Nilsson Lindelöf, Gustaf/Lagerbielke, Lucas/Bergvall, Hugo/Larsson, Jesper/Karlström, Yasin/Ayari, Mattias/Svanberg, Daniel/Svensson, Ken/Sema, Roony/Bardghji, Dejan/Kulusevski, Anthony/Elanga, Alexander/Isak, Viktor/Gyökeres
- **TUN**: Bechir/Ben Said, Aymen/Dahmen, Van/Valery, Montassar/Talbi, Yassine/Meriah, Ali/Abdi, Dylan/Bronn, Ellyes/Skhiri, Aïssa/Laïdouni, Ferjani/Sassi, Mohamed Ali/Ben Romdhane, Hannibal/Mejbri, Elias/Achouri, Elias/Saad, Hazem/Mastouri, Ismael/Gharbi, Sayfallah/Ltaief, Naim/Sliti
- **TUR**: Uğurcan/Çakır, Mert/Müldür, Zeki/Çelik, Abdulkerim/Bardakcı, Çağlar/Soyuncü, Merih/Demiral, Ferdi/Kadıoğlu, Kaan/Ayhan, İsmail/Yüksek, Hakan/Çalhanoğlu, Orkun/Kökçü, Arda/Güler, İrfan Can/Kahveci, Yunus/Akgün, Can/Uzun, Barış Alper/Yılmaz, Kerem/Aktürkoğlu, Kenan/Yıldız
- **URU**: Sergio/Rochet, Santiago/Mele, Ronald/Araújo, José María/Giménez, Sebastián/Cáceres, Mathías/Olivera, Guillermo/Varela, Nahitan/Nández, Federico/Valverde, Giorgian/De Arrascaeta, Rodrigo/Bentancur, Manuel/Ugarte, Nicolás/de la Cruz, Maxi/Araújo, Darwin/Núñez, Federico/Viñas, Rodrigo/Aguirre, Facundo/Pellistri
- **USA**: Matt/Freese, Chris/Richards, Tim/Ream, Mark/McKenzie, Alex/Freeman, Antonee/Robinson, Tyler/Adams, Tanner/Tessmann, Weston/McKennie, Christian/Roldan, Timothy/Weah, Diego/Luna, Malik/Tillman, Christian/Pulisic, Brenden/Aaronson, Ricardo/Pepi, Haji/Wright, Folarin/Balogun
- **UZB**: Utkir/Yusupov, Farrukh/Savfiev, Sherzod/Nasrullaev, Umar/Eshmurodov, Husniddin/Aliqulov, Rustamjon/Ashurmatov, Khojiakbar/Alijonov, Abdukodir/Khusanov, Odiljon/Hamrobekov, Otabek/Shukurov, Jamshid/Iskanderov, Azizbek/Turgunboev, Khojimat/Erkinov, Eldor/Shomurodov, Oston/Urunov, Jaloliddin/Masharipov, Igor/Sergeev, Abbosbek/Fayzullaev

**Extras FIFA (FWC00–FWC19)**: FWC00 Escudo/Logo Oficial da Panini; FWC01 Emblema Oficial da FIFA World Cup 2026 (Parte Esquerda); FWC02 Emblema Oficial da FIFA World Cup 2026 (Parte Direita / Troféu); FWC03 Mascotes Oficiais da Competição; FWC04 Slogan Oficial (We Are 26); FWC05 Bola Oficial do Torneio (Trionda); FWC06 Host Countries & Cities – Canadá; FWC07 Host Countries & Cities – México; FWC08 Host Countries & Cities – USA; FWC09 FIFA Museum / Taça Jules Rimet; FWC10 Pôster Histórico – Uruguai 1950; FWC11 Pôster Histórico – Alemanha Ocidental 1954; FWC12 Pôster Histórico – Brasil 1962; FWC13 Pôster Histórico – Alemanha Ocidental 1974; FWC14 Pôster Histórico – Argentina 1986; FWC15 Pôster Histórico – Brasil 1994; FWC16 Pôster Histórico – Brasil 2002; FWC17 Pôster Histórico – Itália 2006; FWC18 Pôster Histórico – França 2018; FWC19 Pôster Histórico / Último Campeão – Argentina 2022.

**Coca-Cola (COC01–COC14)**: Lamine Yamal; Joshua Kimmich; Harry Kane; Santiago Giménez; Joško Gvardiol; Federico Valverde; Jefferson Lerma; Enner Valencia; Gabriel Magalhães; Virgil van Dijk; Alphonso Davies; Emiliano Martínez; Raúl Jiménez; Lautaro Martínez.

## Consequências

- Todas as 994 figurinhas exibem nome
- O catálogo passa a expor o nome completo e as duas linhas de exibição de cada figurinha, derivados de um arquivo próprio — o resto do app, o Firestore e o formato de intercâmbio não mudam ([MDR 0002](0002-schema-do-documento-da-colecao.md), [MDR 0004](0004-formato-de-intercambio-da-colecao.md))
- `src/data/jogadores.js` é transcrição direta das listas deste registro — a conferência da Tarefa 0017-0001 é contra ele

## Alternativas consideradas

- **Listas no registro de interface (IDR 0047)**: Rejeitado - dado de 994 nomes não é decisão de interface; a casa do dado de catálogo é um MDR — e a primeira listagem embutida lá veio defeituosa, sem validação
- **Provisão apenas em conversa, sem registro**: Rejeitado - a definição do dado ficaria sem casa durável; a execução transcreveria de memória, sem conferência
- **Corte prenomes/sobrenome derivado por regra mecânica na exibição**: Rejeitado - "tudo antes do último nome" quebraria sobrenomes compostos (Galarza Fonda, Ben Romdhane, van de Ven, Ati Zigi, Gana Gueye); o corte é dado explícito, por jogador
- **Nomes como literais em `catalogo.js`**: Rejeitado - 864 jogadores tornariam o arquivo ilegível; arquivo próprio mantém o espírito da expansão por função pura (TDR 0010)
- **Bloquear a fase até completar o Paraguai**: Rejeitado - 5 figurinhas sem nome não justificavam segurar as demais; a lacuna foi declarada e fechada ainda no planejamento, com o complemento da fonte
- **Grafia verbatim da fonte**: Rejeitado - erros de transcrição evidentes entrariam como dado

## Histórico

- 2026-09-14 — Revisão do PR da Fase 17: optamos por ajustar o layout do
  cartão ([IDR 0047](../idr/0047-nomes-de-jogadores-nas-figurinhas.md)) —
  código e nome em metades, escudo e foto do time só com o código. Os campos
  `nome` e `nomeLinhas` e as listas não mudam; muda só a descrição de como
  são exibidos. Antes: nome abaixo do código em todas as figurinhas, nome
  único sozinho na segunda linha.
- 2026-09-13 — Revisão do planejamento das Fases 11–17: fixados os campos
  `nome` e `nomeLinhas` da figurinha no catálogo — antes a Fase 17 falava em
  "nome completo e duas linhas de exibição" sem nome de campo, e o cartão
  recebia só `nome`, o que obrigaria a separar pela barra na tela, errado
  para os Extras FIFA com barra literal. Corrigidas três grafias: Farés
  Chaibi → Farès Chaïbi, Bathuisi → Bathusi Aubaas, Ioraam → Iqraam Rayners.
- 2026-09-13 — Esclarecimento do humano sobre a exibição (duas linhas; prenomes em
  caixa normal; sobrenome em caixa alta; nome único sozinho na segunda linha):
  o corte prenomes/sobrenome passa a ser dado explícito por jogador e as listas
  são reescritas como "Prenomes/Sobrenome" — sem barra, nome único. Extras
  FIFA, Coca-Cola e posições fixas continuam sem corte.
- 2026-09-13 — Complemento do Paraguai: a fonte trouxe as posições
  PAR16–PAR20 (Alejandro Romero Gamarra, Miguel Almirón, Ramón Sosa, Ángel
  Romero, Antonio Sanabria), chaveadas por posição e coincidentes com o
  mapeamento nas 15 primeiras — a lacuna declarada fecha e todas as 994
  figurinhas passam a ter nome. A provisão do Paraguai nomeia as posições
  fixas como "Escudo da Seleção" e "Foto do Time (Elenco)"; o rótulo
  uniforme das 48 seleções ("Escudo do time" / "Foto do time") prevalece.
  Grafia do complemento: "Antônio" corrigido para Antonio Sanabria;
  Mathías Villasanti e Damián Bobadilla seguem acentuados, como na provisão
  anterior.
- 2026-09-13 — As listas confirmadas passam a morar neste registro, por decisão do
  humano: o MDR descreve o nome das figurinhas e a execução transcreve daqui para
  `src/data/jogadores.js`. A versão anterior descrevia só as decisões e mantinha a
  provisão fora do registro; a alternativa "provisão apenas em conversa" foi rejeitada.

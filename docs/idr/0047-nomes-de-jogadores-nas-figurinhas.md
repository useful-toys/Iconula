<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0047: Nomes de jogadores nas figurinhas

## Status

Aceito

## Contexto

O álbum Panini da Copa 2026 tem 994 figurinhas. Atualmente, o app exibe apenas o código (ex.: "BRA 05") sem indicar qual jogador ou elemento a figurinha representa. Identificar cada figurinha exige conhecimento prévio do álbum ou consulta externa.

## Decisão

Adicionar o nome do jogador/elemento abaixo do código em cada cartão, com as seguintes regras:

- **Posição**: Nome abaixo do código (sigla + número)
- **Truncamento**: Ellipsis (...) para nomes longos
- **Disposições**: Visível em lista e álbum
- **Acessibilidade**: Nome incluído no aria-label
- **Fonte**: Sans-serif (system-ui), menor que o código

### Dados

Os nomes estão armazenados em `src/data/jogadores.js`:

- **Seleções**: 48 × 18 jogadores + "Escudo do time" (01) + "Foto do time" (13)
- **Extras FIFA**: 20 nomes (FWC00-FWC19)
- **Coca-Cola**: 14 nomes (COC01-COC14)

### Mapeamento de posições

Para seleções:
- Posição 01: "Escudo do time"
- Posições 02-12: Jogadores 1-11
- Posição 13: "Foto do time"
- Posições 14-20: Jogadores 12-18

### Lista completa de códigos e nomes

#### Extras FIFA (FWC00–FWC19)

| Código | Nome |
|--------|------|
| FWC00 | Escudo/Logo Oficial da Panini |
| FWC01 | Emblema Oficial da FIFA World Cup 2026 (Parte Esquerda) |
| FWC02 | Emblema Oficial da FIFA World Cup 2026 (Parte Direita / Troféu) |
| FWC03 | Mascotes Oficiais da Competição |
| FWC04 | Slogan Oficial (We Are 26) |
| FWC05 | Bola Oficial do Torneio (Trionda) |
| FWC06 | Host Countries & Cities – Canadá |
| FWC07 | Host Countries & Cities – México |
| FWC08 | Host Countries & Cities – USA |
| FWC09 | FIFA Museum / Taça Jules Rimet |
| FWC10 | Pôster Histórico – Uruguai 1950 |
| FWC11 | Pôster Histórico – Alemanha Ocidental 1954 |
| FWC12 | Pôster Histórico – Brasil 1962 |
| FWC13 | Pôster Histórico – Alemanha Ocidental 1974 |
| FWC14 | Pôster Histórico – Argentina 1986 |
| FWC15 | Pôster Histórico – Brasil 1994 |
| FWC16 | Pôster Histórico – Brasil 2002 |
| FWC17 | Pôster Histórico – Itália 2006 |
| FWC18 | Pôster Histórico – França 2018 |
| FWC19 | Pôster Histórico / Último Campeão – Argentina 2022 |

#### Coca-Cola (COC01–COC14)

| Código | Nome |
|--------|------|
| COC01 | Lamine Yamal |
| COC02 | Joshua Kimmich |
| COC03 | Harry Kane |
| COC04 | Santiago Giménez |
| COC05 | Josko Gvardiol |
| COC06 | Federico Valverde |
| COC07 | Jefferson Lerma |
| COC08 | Enner Valencia |
| COC09 | Gabriel Magalhães |
| COC10 | Virgil van Dijk |
| COC11 | Alphonso Davies |
| COC12 | Emiliano Martínez |
| COC13 | Raúl Jiménez |
| COC14 | Lautaro Martínez |

#### Seleções (48 × 20 códigos)

**ALG (Argélia):**
ALG01 Escudo do time, ALG02 Alexis Guendouz, ALG03 Ramy Bensebaini, ALG04 Youcef Atal, ALG05 Rayan Aït-Nouri, ALG06 Mohamed Amine Tougai, ALG07 Aïssa Mandi, ALG08 Ismael Bennacer, ALG09 Houssem Aouar, ALG10 Hicham Boudaoui, ALG11 Ramiz Zerrouki, ALG12 Nabil Bentaleb, ALG13 Foto do time, ALG14 Farés Chaibi, ALG15 Riyad Mahrez, ALG16 Said Benrahma, ALG17 Anis Hadj Moussa, ALG18 Amine Gouiri, ALG19 Baghdad Bounedjah, ALG20 Mohammed Amoura

**ARG (Argentina):**
ARG01 Escudo do time, ARG02 Emiliano Martínez, ARG03 Nahuel Molina, ARG04 Cristian Romero, ARG05 Nicolás Otamendi, ARG06 Nicolás Tagliafico, ARG07 Leonardo Balerdi, ARG08 Enzo Fernández, ARG09 Alexis Mac Allister, ARG10 Rodrigo De Paul, ARG11 Exequiel Palacios, ARG12 Leandro Paredes, ARG13 Foto do time, ARG14 Nico Paz, ARG15 Franco Mastantuono, ARG16 Nico González, ARG17 Lionel Messi, ARG18 Lautaro Martínez, ARG19 Julián Álvarez, ARG20 Giuliano Simeone

**AUS (Austrália):**
AUS01 Escudo do time, AUS02 Mathew Ryan, AUS03 Joe Gauci, AUS04 Harry Souttar, AUS05 Alessandro Circati, AUS06 Jordan Bos, AUS07 Aziz Behich, AUS08 Cameron Burgess, AUS09 Lewis Miller, AUS10 Milos Degenek, AUS11 Jackson Irvine, AUS12 Riley McGree, AUS13 Foto do time, AUS14 Aiden O'Neill, AUS15 Connor Metcalfe, AUS16 Patrick Yazbek, AUS17 Craig Goodwin, AUS18 Kusini Yengi, AUS19 Nestory Irankunda, AUS20 Mohamed Touré

**AUT (Áustria):**
AUT01 Escudo do time, AUT02 Alexander Schlager, AUT03 Patrick Pentz, AUT04 David Alaba, AUT05 Kevin Danso, AUT06 Philipp Lienhart, AUT07 Stefan Posch, AUT08 Phillipp Mwene, AUT09 Alexander Prass, AUT10 Xaver Schlager, AUT11 Marcel Sabitzer, AUT12 Konrad Laimer, AUT13 Foto do time, AUT14 Florian Grillitsch, AUT15 Nicolas Seiwald, AUT16 Romano Schmid, AUT17 Patrick Wimmer, AUT18 Christoph Baumgartner, AUT19 Michael Gregoritsch, AUT20 Marko Arnautović

**BEL (Bélgica):**
BEL01 Escudo do time, BEL02 Thibaut Courtois, BEL03 Arthur Theate, BEL04 Timothy Castagne, BEL05 Zeno Debast, BEL06 Brandon Mechele, BEL07 Maxim De Cuyper, BEL08 Thomas Meunier, BEL09 Youri Tielemans, BEL10 Amadou Onana, BEL11 Nicolas Raskin, BEL12 Alexis Saelemaekers, BEL13 Foto do time, BEL14 Hans Vanaken, BEL15 Kevin De Bruyne, BEL16 Jérémy Doku, BEL17 Charles De Ketelaere, BEL18 Leandro Trossard, BEL19 Loïs Openda, BEL20 Romelu Lukaku

**BIH (Bósnia-Herzegovina):**
BIH01 Escudo do time, BIH02 Nikola Vasilj, BIH03 Amar Dedić, BIH04 Sead Kolašinac, BIH05 Tarik Muharemović, BIH06 Nihad Mujakić, BIH07 Nikola Katić, BIH08 Amir Hadžiahmetović, BIH09 Benjamin Tahirović, BIH10 Armin Gigović, BIH11 Ivan Šunjić, BIH12 Ivan Bašić, BIH13 Foto do time, BIH14 Dženis Burnić, BIH15 Esmir Bajraktarević, BIH16 Amar Memić, BIH17 Ermedin Demirović, BIH18 Edin Džeko, BIH19 Samed Baždar, BIH20 Haris Tabaković

**BRA (Brasil):**
BRA01 Escudo do time, BRA02 Alisson, BRA03 Bento, BRA04 Marquinhos, BRA05 Éder Militão, BRA06 Gabriel Magalhães, BRA07 Danilo, BRA08 Wesley, BRA09 Lucas Paquetá, BRA10 Casemiro, BRA11 Bruno Guimarães, BRA12 Luiz Henrique, BRA13 Foto do time, BRA14 Vinícius Júnior, BRA15 Rodrygo, BRA16 João Pedro, BRA17 Matheus Cunha, BRA18 Gabriel Martinelli, BRA19 Raphinha, BRA20 Estêvão

**CAN (Canadá):**
CAN01 Escudo do time, CAN02 Dayne St. Clair, CAN03 Alphonso Davies, CAN04 Alistair Johnston, CAN05 Samuel Adekugbe, CAN06 Richie Laryea, CAN07 Derek Cornelius, CAN08 Moïse Bombito, CAN09 Kamal Miller, CAN10 Stephen Eustáquio, CAN11 Ismaël Koné, CAN12 Jonathan Osorio, CAN13 Foto do time, CAN14 Jacob Shaffelburg, CAN15 Mathieu Choinière, CAN16 Niko Sigur, CAN17 Tajon Buchanan, CAN18 Liam Millar, CAN19 Cyle Larin, CAN20 Jonathan David

**CIV (Costa do Marfim):**
CIV01 Escudo do time, CIV02 Yahia Fofana, CIV03 Ghislain Konan, CIV04 Wilfried Singo, CIV05 Odilon Kossounou, CIV06 Evan Ndicka, CIV07 Willy Boly, CIV08 Emmanuel Agbadou, CIV09 Ousmane Diomande, CIV10 Franck Kessié, CIV11 Seko Fofana, CIV12 Ibrahim Sangaré, CIV13 Foto do time, CIV14 Jean-Philippe Gbamin, CIV15 Amad Diallo, CIV16 Sébastien Haller, CIV17 Simon Adingra, CIV18 Yan Diomande, CIV19 Evann Guessand, CIV20 Oumar Diakité

**COD (Congo DR):**
COD01 Escudo do time, COD02 Lionel Mpasi, COD03 Aaron Wan-Bissaka, COD04 Axel Tuanzebe, COD05 Arthur Masuaku, COD06 Chancel Mbemba, COD07 Joris Kayembe, COD08 Charles Pickel, COD09 Ngal'ayel Mukau, COD10 Edo Kayembe, COD11 Samuel Moutoussamy, COD12 Noah Sadiki, COD13 Foto do time, COD14 Théo Bongonda, COD15 Meschack Elia, COD16 Yoane Wissa, COD17 Brian Cipenga, COD18 Fiston Mayele, COD19 Cédric Bakambu, COD20 Nathanaël Mbuku

**COL (Colômbia):**
COL01 Escudo do time, COL02 Camilo Vargas, COL03 David Ospina, COL04 Dávinson Sánchez, COL05 Yerry Mina, COL06 Daniel Muñoz, COL07 Johan Mojica, COL08 Jhon Lucumí, COL09 Santiago Arias, COL10 Jefferson Lerma, COL11 Kevin Castaño, COL12 Richard Ríos, COL13 Foto do time, COL14 James Rodríguez, COL15 Juan Fernando Quintero, COL16 Jorge Carrascal, COL17 Jhon Arias, COL18 Jhon Córdoba, COL19 Luis Suárez, COL20 Luis Díaz

**CPV (Cabo Verde):**
CPV01 Escudo do time, CPV02 Vozinha, CPV03 Logan Costa, CPV04 Pico, CPV05 Diney, CPV06 Steven Moreira, CPV07 Wagner Pina, CPV08 João Paulo, CPV09 Yannick Semedo, CPV10 Kevin Pina, CPV11 Patrick Andrade, CPV12 Jamiro Monteiro, CPV13 Foto do time, CPV14 Deroy Duarte, CPV15 Garry Rodrigues, CPV16 Jovane Cabral, CPV17 Ryan Mendes, CPV18 Dailon Livramento, CPV19 Willy Semedo, CPV20 Bebé

**CRO (Croácia):**
CRO01 Escudo do time, CRO02 Dominik Livaković, CRO03 Duje Ćaleta-Car, CRO04 Joško Gvardiol, CRO05 Josip Stanišić, CRO06 Luka Vušković, CRO07 Josip Šutalo, CRO08 Kristijan Jakić, CRO09 Luka Modrić, CRO10 Mateo Kovačić, CRO11 Martin Baturina, CRO12 Lovro Majer, CRO13 Foto do time, CRO14 Ivan Perišić, CRO15 Marco Pašalić, CRO16 Ante Budimir, CRO17 Andrej Kramarić, CRO18 Franjo Ivanović, CRO19 Petar Sučić, CRO20 Mario Pašalić

**CUW (Curaçao):**
CUW01 Escudo do time, CUW02 Eloy Room, CUW03 Armando Obispo, CUW04 Sherel Floranus, CUW05 Jurien Gaari, CUW06 Joshua Brenet, CUW07 Roshon Van Eijma, CUW08 Shurandy Sambo, CUW09 Livano Comenencia, CUW10 Godfried Roemeratoe, CUW11 Juninho Bacuna, CUW12 Leandro Bacuna, CUW13 Foto do time, CUW14 Tahith Chong, CUW15 Kenji Gorré, CUW16 Jearl Margaritha, CUW17 Jurgen Locadia, CUW18 Jeremy Antonisse, CUW19 Gervane Kastaneer, CUW20 Sontje Hansen

**CZE (Chéquia):**
CZE01 Escudo do time, CZE02 Matěj Kovář, CZE03 Jindřich Staněk, CZE04 Ladislav Krejčí, CZE05 Vladimír Coufal, CZE06 Jaroslav Zelený, CZE07 Tomáš Holeš, CZE08 David Zima, CZE09 Michal Sadílek, CZE10 Lukáš Provod, CZE11 Lukáš Červ, CZE12 Tomáš Souček, CZE13 Foto do time, CZE14 Pavel Šulc, CZE15 Matěj Vydra, CZE16 Vasil Kušej, CZE17 Tomáš Chorý, CZE18 Václav Černý, CZE19 Adam Hložek, CZE20 Patrik Schick

**ECU (Equador):**
ECU01 Escudo do time, ECU02 Hernán Galíndez, ECU03 Gonzalo Valle, ECU04 Piero Hincapié, ECU05 Pervis Estupiñán, ECU06 Willian Pacho, ECU07 Ángelo Preciado, ECU08 Joel Ordóñez, ECU09 Moisés Caicedo, ECU10 Alan Franco, ECU11 Kendry Páez, ECU12 Pedro Vite, ECU13 Foto do time, ECU14 John Yeboah, ECU15 Leonardo Campana, ECU16 Gonzalo Plata, ECU17 Nilson Angulo, ECU18 Alan Minda, ECU19 Kevin Rodríguez, ECU20 Enner Valencia

**EGY (Egito):**
EGY01 Escudo do time, EGY02 Mohamed El Shenawy, EGY03 Mohamed Hany, EGY04 Mohamed Hamdy, EGY05 Yasser Ibrahim, EGY06 Khaled Sobhi, EGY07 Ramy Rabia, EGY08 Hossam Abdelmaguid, EGY09 Ahmed Fatouh, EGY10 Marwan Attia, EGY11 Zizo, EGY12 Hamdy Fathy, EGY13 Foto do time, EGY14 Mohamed Lasheen, EGY15 Emam Ashour, EGY16 Osama Faisal, EGY17 Mohamed Salah, EGY18 Mostafa Mohamed, EGY19 Trezeguet, EGY20 Omar Marmoush

**ENG (Inglaterra):**
ENG01 Escudo do time, ENG02 Jordan Pickford, ENG03 John Stones, ENG04 Marc Guéhi, ENG05 Ezri Konsa, ENG06 Trent Alexander-Arnold, ENG07 Reece James, ENG08 Dan Burn, ENG09 Jordan Henderson, ENG10 Declan Rice, ENG11 Jude Bellingham, ENG12 Cole Palmer, ENG13 Foto do time, ENG14 Phil Foden, ENG15 Bukayo Saka, ENG16 Harry Kane, ENG17 Marcus Rashford, ENG18 Ollie Watkins, ENG19 Morgan Rogers, ENG20 Anthony Gordon

**ESP (Espanha):**
ESP01 Escudo do time, ESP02 Unai Simón, ESP03 Robin Le Normand, ESP04 Aymeric Laporte, ESP05 Dean Huijsen, ESP06 Pedro Porro, ESP07 Dani Carvajal, ESP08 Marc Cucurella, ESP09 Martín Zubimendi, ESP10 Rodri, ESP11 Pedri, ESP12 Fabián Ruiz, ESP13 Foto do time, ESP14 Mikel Merino, ESP15 Lamine Yamal, ESP16 Dani Olmo, ESP17 Nico Williams, ESP18 Ferran Torres, ESP19 Álvaro Morata, ESP20 Mikel Oyarzabal

**FRA (França):**
FRA01 Escudo do time, FRA02 Mike Maignan, FRA03 Theo Hernández, FRA04 William Saliba, FRA05 Jules Koundé, FRA06 Ibrahima Konaté, FRA07 Dayot Upamecano, FRA08 Lucas Digne, FRA09 Aurélien Tchouaméni, FRA10 Eduardo Camavinga, FRA11 Manu Koné, FRA12 Adrien Rabiot, FRA13 Foto do time, FRA14 Michael Olise, FRA15 Ousmane Dembélé, FRA16 Bradley Barcola, FRA17 Désiré Doué, FRA18 Kingsley Coman, FRA19 Hugo Ekitike, FRA20 Kylian Mbappé

**GER (Alemanha):**
GER01 Escudo do time, GER02 Marc-André ter Stegen, GER03 Jonathan Tah, GER04 David Raum, GER05 Nico Schlotterbeck, GER06 Antonio Rüdiger, GER07 Waldemar Anton, GER08 Ridle Baku, GER09 Maximilian Mittelstädt, GER10 Joshua Kimmich, GER11 Florian Wirtz, GER12 Felix Nmecha, GER13 Foto do time, GER14 Jamal Musiala, GER15 Serge Gnabry, GER16 Kai Havertz, GER17 Leroy Sané, GER18 Karim Adeyemi, GER19 Nick Woltemade, GER20 Leon Goretzka

**GHA (Gana):**
GHA01 Escudo do time, GHA02 Lawrence Ati Zigi, GHA03 Tariq Lamptey, GHA04 Mohammed Salisu, GHA05 Alidu Seidu, GHA06 Alexander Djiku, GHA07 Gideon Mensah, GHA08 Caleb Yirenkyi, GHA09 Abdul Fatawu Issahaku, GHA10 Thomas Partey, GHA11 Salis Abdul Samed, GHA12 Kamaldeen Sulemana, GHA13 Foto do time, GHA14 Mohammed Kudus, GHA15 Iñaki Williams, GHA16 Jordan Ayew, GHA17 André Ayew, GHA18 Joseph Paintsil, GHA19 Osman Bukari, GHA20 Antoine Semenyo

**HAI (Haiti):**
HAI01 Escudo do time, HAI02 Johny Placide, HAI03 Carlens Arcus, HAI04 Martin Expérience, HAI05 Jean-Kevin Duverne, HAI06 Ricardo Adé, HAI07 Duke Lacroix, HAI08 Garven Metusala, HAI09 Hannes Delcroix, HAI10 Leverton Pierre, HAI11 Danley Jean Jacques, HAI12 Jean-Ricner Bellegarde, HAI13 Foto do time, HAI14 Josué Casimir, HAI15 Ruben Providence, HAI16 Duckens Nazon, HAI17 Louicius Deedson, HAI18 Frantzdy Pierrot, HAI19 Christopher Attys, HAI20 Derrick Etienne Jr.

**IRN (Irã):**
IRN01 Escudo do time, IRN02 Alireza Beiranvand, IRN03 Morteza Pouraliganji, IRN04 Ehsan Hajsafi, IRN05 Milad Mohammadi, IRN06 Shoja Khalilzadeh, IRN07 Ramin Rezaeian, IRN08 Hossein Kanaani, IRN09 Sadegh Moharrami, IRN10 Saleh Hardani, IRN11 Saeed Ezatolahi, IRN12 Saman Ghoddos, IRN13 Foto do time, IRN14 Omid Noorafkan, IRN15 Roozbeh Cheshmi, IRN16 Mohammad Mohebi, IRN17 Sardar Azmoun, IRN18 Mehdi Taremi, IRN19 Alireza Jahanbakhsh, IRN20 Ali Gholizadeh

**IRQ (Iraque):**
IRQ01 Escudo do time, IRQ02 Jalal Hassan, IRQ03 Rebin Sulaka, IRQ04 Hussein Ali, IRQ05 Akam Hashem, IRQ06 Merchas Doski, IRQ07 Zaid Tahseen, IRQ08 Manaf Younis, IRQ09 Zidane Iqbal, IRQ10 Amir Al-Ammari, IRQ11 Ibrahim Bayesh, IRQ12 Ali Jasim, IRQ13 Foto do time, IRQ14 Youssef Amyn, IRQ15 Aimar Sher, IRQ16 Marko Farji, IRQ17 Osama Rashid, IRQ18 Ali Al-Hamadi, IRQ19 Aymen Hussein, IRQ20 Mohanad Ali

**JOR (Jordânia):**
JOR01 Escudo do time, JOR02 Yazeed Abulaila, JOR03 Ihsan Haddad, JOR04 Mohammad Abu Hashish, JOR05 Yazan Al-Arab, JOR06 Abdallah Nasib, JOR07 Saleem Obaid, JOR08 Mohammad Abualnadi, JOR09 Ibrahim Saadeh, JOR10 Nizar Al-Rashdan, JOR11 Noor Al-Rawabdeh, JOR12 Mohannad Abu Taha, JOR13 Foto do time, JOR14 Musa Al-Taamari, JOR15 Yazan Al-Naimat, JOR16 Mahmoud Al-Mardi, JOR17 Ali Olwan, JOR18 Mohammad Abu Zrayq, JOR19 Ibrahim Sabra, JOR20 Amer Jamous

**JPN (Japão):**
JPN01 Escudo do time, JPN02 Zion Suzuki, JPN03 Henry Heroki Mochizuki, JPN04 Ayumu Seko, JPN05 Junnosuke Suzuki, JPN06 Shogo Taniguchi, JPN07 Tsuyoshi Watanabe, JPN08 Kaishu Sano, JPN09 Yuki Soma, JPN10 Ao Tanaka, JPN11 Daichi Kamada, JPN12 Takefusa Kubo, JPN13 Foto do time, JPN14 Ritsu Doan, JPN15 Keito Nakamura, JPN16 Takumi Minamino, JPN17 Shuto Machino, JPN18 Junya Ito, JPN19 Koki Ogawa, JPN20 Ayase Ueda

**KOR (Coreia do Sul):**
KOR01 Escudo do time, KOR02 Hyeon-woo Jo, KOR03 Seung-Gyu Kim, KOR04 Min-jae Kim, KOR05 Yu-min Cho, KOR06 Young-woo Seol, KOR07 Han-beom Lee, KOR08 Tae-seok Lee, KOR09 Myung-jae Lee, KOR10 Jae-sung Lee, KOR11 In-beom Hwang, KOR12 Kang-in Lee, KOR13 Foto do time, KOR14 Seung-ho Paik, KOR15 Jens Castrop, KOR16 Dong-gyeong Lee, KOR17 Gue-sung Cho, KOR18 Heung-min Son, KOR19 Hee-chan Hwang, KOR20 Hyeon-Gyu Oh

**KSA (Arábia Saudita):**
KSA01 Escudo do time, KSA02 Nawaf Alaqidi, KSA03 Abdulrahman Al-Sanbi, KSA04 Saud Abdulhamid, KSA05 Nawaf Boushal, KSA06 Jihad Thakri, KSA07 Moteb Al-Harbi, KSA08 Hassan Altambakti, KSA09 Musab Aljuwayr, KSA10 Ziyad Aljohani, KSA11 Abdullah Alkhaibari, KSA12 Nasser Aldawsari, KSA13 Foto do time, KSA14 Saleh Abu Alshamat, KSA15 Marwan Alsahafi, KSA16 Salem Aldawsari, KSA17 Abdulrahman Al-Aboud, KSA18 Feras Albrikan, KSA19 Saleh Alshehri, KSA20 Abdullah Al-Hamdan

**MAR (Marrocos):**
MAR01 Escudo do time, MAR02 Yassine Bounou, MAR03 Munir El Kajoui, MAR04 Achraf Hakimi, MAR05 Noussair Mazraoui, MAR06 Nayef Aguerd, MAR07 Romain Saïss, MAR08 Jawad El Yamiq, MAR09 Adam Masina, MAR10 Sofyan Amrabat, MAR11 Azzedine Ounahi, MAR12 Eliesse Ben Seghir, MAR13 Foto do time, MAR14 Bilal El Khannouss, MAR15 Ismael Saibari, MAR16 Youssef En-Nesyri, MAR17 Abde Ezzalzouli, MAR18 Soufiane Rahimi, MAR19 Brahim Díaz, MAR20 Ayoub El Kaabi

**MEX (México):**
MEX01 Escudo do time, MEX02 Luis Malagón, MEX03 Johan Vásquez, MEX04 Jorge Sánchez, MEX05 César Montes, MEX06 Jesús Gallardo, MEX07 Israel Reyes, MEX08 Diego Lainez, MEX09 Carlos Rodríguez, MEX10 Edson Álvarez, MEX11 Orbelín Pineda, MEX12 Marcel Ruiz, MEX13 Foto do time, MEX14 Érick Sánchez, MEX15 Hirving Lozano, MEX16 Santiago Giménez, MEX17 Raúl Jiménez, MEX18 Alexis Vega, MEX19 Roberto Alvarado, MEX20 César Huerta

**NED (Países Baixos):**
NED01 Escudo do time, NED02 Bart Verbruggen, NED03 Virgil van Dijk, NED04 Micky van de Ven, NED05 Jurriën Timber, NED06 Denzel Dumfries, NED07 Nathan Aké, NED08 Jeremie Frimpong, NED09 Jan Paul van Hecke, NED10 Tijjani Reijnders, NED11 Ryan Gravenberch, NED12 Teun Koopmeiners, NED13 Foto do time, NED14 Frenkie de Jong, NED15 Xavi Simons, NED16 Justin Kluivert, NED17 Memphis Depay, NED18 Donyell Malen, NED19 Wout Weghorst, NED20 Cody Gakpo

**NOR (Noruega):**
NOR01 Escudo do time, NOR02 Ørjan Nyland, NOR03 Julian Ryerson, NOR04 Leo Østigård, NOR05 Kristoffer Ajer, NOR06 Marcus Holmgren Pedersen, NOR07 David Møller Wolfe, NOR08 Torbjørn Heggem, NOR09 Morten Thorsby, NOR10 Martin Ødegaard, NOR11 Sander Berge, NOR12 Andreas Schjelderup, NOR13 Foto do time, NOR14 Patrick Berg, NOR15 Erling Haaland, NOR16 Alexander Sørloth, NOR17 Aron Dønnum, NOR18 Jørgen Strand Larsen, NOR19 Antonio Nusa, NOR20 Oscar Bobb

**NZL (Nova Zelândia):**
NZL01 Escudo do time, NZL02 Max Crocombe-Payne, NZL03 Michael Boxall, NZL04 Liberato Cacace, NZL05 Tim Payne, NZL06 Tyler Bindon, NZL07 Francis de Vries, NZL08 Finn Surman, NZL09 Joe Bell, NZL10 Sarpreet Singh, NZL11 Ryan Thomas, NZL12 Matthew Garbett, NZL13 Foto do time, NZL14 Ben Old, NZL15 Marko Stamenić, NZL16 Chris Wood, NZL17 Elijah Just, NZL18 Callum McCowatt, NZL19 Kosta Barbarouses, NZL20 Max Crocombe

**PAN (Panamá):**
PAN01 Escudo do time, PAN02 Orlando Mosquera, PAN03 Fidel Escobar, PAN04 Andrés Andrade, PAN05 Michael Amir Murillo, PAN06 Eric Davis, PAN07 José Córdoba, PAN08 César Blackman, PAN09 Cristian Martínez, PAN10 Adalberto Carrasquilla, PAN11 Aníbal Godoy, PAN12 Adalberto Carrasquilla, PAN13 Foto do time, PAN14 Ismael Díaz, PAN15 José Fajardo, PAN16 Cecilio Waterman, PAN17 José Luis Rodríguez, PAN18 Alberto Quintero, PAN19 Édgar Bárcenas, PAN20 Luis Mejía

**PAR (Paraguai):**
PAR01 Escudo do time, PAR02 Roberto Fernández, PAR03 Fabián Balbuena, PAR04 Gustavo Gómez, PAR05 Junior Alonso, PAR06 Mathías Villasanti, PAR07 Omar Alderete, PAR08 Diego Gómez, PAR09 Damián Bobadilla, PAR10 Andrés Cubas, PAR11 Matías Galarza Fonda, PAR12 Julio Enciso, PAR13 Foto do time, PAR14 Juan José Cáceres, PAR15 Richard Ríos, PAR16 Jorge Carrascal, PAR17 Jhon Arias, PAR18 Jhon Córdoba, PAR19 Luis Díaz, PAR20 Luis Suárez

**POR (Portugal):**
POR01 Escudo do time, POR02 Diogo Costa, POR03 João Cancelo, POR04 Rúben Dias, POR05 Nuno Mendes, POR06 Danilo Pereira, POR07 Pepe, POR08 Rúben Neves, POR09 Bruno Fernandes, POR10 João Mário, POR11 João Moutinho, POR12 José Sá, POR13 Foto do time, POR14 Gonçalo Guedes, POR15 Rafa Silva, POR16 Gonçalo Ramos, POR17 João Cancelo, POR18 Diogo Jota, POR19 Vitinha, POR20 Francisco Trincão

**QAT (Catar):**
QAT01 Escudo do time, QAT02 Meshaal Barsham, QAT03 Sultan Al-Brake, QAT04 Lucas Mendes, QAT05 Homam Ahmed, QAT07 Boualem Khoukhi, QAT08 Pedro Miguel, QAT09 Tarek Salman, QAT10 Mohamed Waad, QAT11 Abdelrahman Moustafa, QAT12 Karim Boudiaf, QAT13 Foto do time, QAT14 Assim Madibo, QAT15 Akram Afif, QAT16 Almoez Ali, QAT17 Yusuf Abdurisag, QAT18 Ismaeel Mohammed, QAT19 Mohammed Muntari, QAT20 Ahmed Al-Rawi

**SCO (Escócia):**
SCO01 Escudo do time, SCO02 Angus Gunn, SCO03 Jack Hendry, SCO05 Grant Hanley, SCO06 Scott McKenna, SCO07 John Souttar, SCO08 Anthony Ralston, SCO09 Andrew Robertson, SCO10 Kieran Tierney, SCO11 Scott McTominay, SCO12 John McGinn, SCO13 Foto do time, SCO14 Billy Gilmour, SCO15 Ryan Christie, SCO16 Stuart Armstrong, SCO17 Ché Adams, SCO18 Ryan Porteous, SCO19 Lyndon Dykes, SCO20 Lawrence Shankland

**SWE (Suécia):**
SWE01 Escudo do time, SWE02 Karl-Johan Johnsson, SWE03 Mikael Lustig, SWE05 Victor Lindelöf, SWE06 Ludwig Augustinsson, SWE07 Sebastian Larsson, SWE08 Albin Ekdal, SWE09 Marcus Berg, SWE10 Emil Forsberg, SWE11 Alexander Isak, SWE13 Foto do time, SWE15 Ken Sema, SWE17 Viktor Claesson, SWE18 Robin Quaison, SWE19 Marcus Danielson, SWE20 Kristoffer Olsson

**TUN (Tunísia):**
TUN01 Escudo do time, TUN02 Bechir Ben Said, TUN03 Montassar Talbi, TUN04 Yassine Meriah, TUN05 Ali Abdi, TUN06 Dylan Bronn, TUN07 Ellyes Skhiri, TUN08 Aïssa Laïdouni, TUN09 Ferjani Sassi, TUN10 Anis Ben Slimane, TUN11 Naim Sliti, TUN13 Foto do time, TUN14 Mohamed Dräger, TUN15 Mohamed Ali Ben Romdhane, TUN16 Hannibal Mejbri, TUN17 Youssef Msakni, TUN18 Ghailene Chaalali, TUN19 Seifeddine Jaziri, TUN20 Aymen Balbouli

**URU (Uruguai):**
URU01 Escudo do time, URU02 Sergio Rochet, URU03 José María Giménez, URU04 Ronald Araújo, URU05 Mathías Vecino, URU06 Matías Olivera, URU07 Guillermo Varela, URU08 Nahitan Nández, URU09 Luis Suárez, URU10 Federico Valverde, URU11 Giorgian De Arrascaeta, URU12 Rodrigo Bentancur, URU13 Foto do time, URU14 Maximiliano Araújo, URU15 Darwin Núñez, URU16 Facundo Pellistri, URU17 Matías Viña, URU18 Brian Rodríguez, URU19 Giovanni Victória, URU20 Agustín Canobbio

**USA (Estados Unidos):**
USA01 Escudo do time, USA02 Matt Turner, USA03 Walker Zimmerman, USA04 Mark McKenzie, USA05 Antonee Robinson, USA06 Yunus Musah, USA07 Giovanni Reyna, USA08 Tyler Adams, USA09 Jesús Ferreira, USA10 Christian Pulisic, USA11 Brenden Aaronson, USA12 Weston McKennie, USA13 Foto do time, USA14 Luca de la Torre, USA15 Tim Ream, USA16 Jordan Morris, USA17 Tim Weah, USA18 Josh Sargent, USA19 Sean Johnson, USA20 Chris Richards

**UZB (Uzbequistão):**
UZB01 Escudo do time, UZB02 Utkir Yusupov, UZB03 Shukhrat Mukhammadiev, UZB04 Egor Krimets, UZB05 Anzur Ismailov, UZB06 Odil Akhmedov, UZB07 Azizbek Haydarov, UZB08 Server Djeparov, UZB09 Eldor Shomurodov, UZB10 Jaloliddin Masharipov, UZB11 Otabek Shukurov, UZB12 Igor Sergeev, UZB13 Foto do time, UZB14 Dostonbek Tursunov, UZB15 Azizbek Amonov, UZB16 Khojimat Erkinov, UZB17 Eldor Shomurodov, UZB18 Azizbek Turgunboev, UZB19 Bobur Abdikholikov, UZB20 Igor Sergeev

## Consequências

- Identificação visual imediata de cada figurinha
- Melhora a experiência de usuários iniciantes
- Aumenta a largura mínima do cartão (nome pode ser mais largo que o código)
- Nomes longos são truncados, perdendo informação visual (mas acessível via aria-label)

## Alternativas consideradas

- **Tooltip no hover**: Rejeitado - não funciona em mobile, exige interação
- **Nome no lugar do código**: Rejeitado - perde a identificação numérica oficial
- **Nome apenas na disposição álbum**: Rejeitado - inconsistência entre disposições
- **Nome completo sem truncamento**: Rejeitado - quebraria o layout em nomes longos

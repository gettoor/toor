/**
 * Contains selected examples derived from:
 *
 * CLARIN-Emo: Emotion detection in Polish
 * https://huggingface.co/datasets/clarin-knext/CLARIN-Emo
 *
 * Licensed under Creative Commons Attribution 4.0 International
 * https://creativecommons.org/licenses/by/4.0/
 *
 * The original dataset has been modified by selecting a subset and
 * transforming it into Toor's dataset format.
 */

import { RPEDatasetEntry } from '@gettoor/core';
import { entry } from './dataset-common.js';

export const CLARIN_EMO_TRAINING: RPEDatasetEntry[] = [
  entry(
    '2 gwiazdki.',
    'negative',
  ),
  entry(
    'Woda jest, telewizor ma ze 20 cali, wiec chyba trafiłem dobrze.',
    'positive',
  ),
  entry(
    'Schodzę na obiadokolacje.',
    'neutral',
  ),
  entry(
    'Na tyle maksymalnie zasługuje ten hotel.',
    'negative',
  ),
  entry(
    'Statyw zwraca na siebie uwagę naprawdę mikroskopijnymi wymiarami (po złożeniu mieści się do plecaka).',
    'positive',
  ),
  entry(
    'Do wyboru jest pomidorowa, sałatka, ryba i schabowy.',
    'neutral',
  ),
  entry(
    'To, ze hotel ma 4 gwiazdki w nazwie jest żałosne.',
    'negative',
  ),
  entry(
    'Po rozłożeniu z wysokością 125cm daje się w miarę wygodnie użytkować.',
    'positive',
  ),
  entry(
    'Wracam wiec do pokoju.',
    'neutral',
  ),
  entry(
    'Śmiesznie było już podczas rezerwacji, pani z recepcji nie bardzo potrafiła odpowiedzieć na najprostsze pytania.',
    'negative',
  ),
  entry(
    'Cena dość niska i dla amatorów wystarczy, jeżeli ktoś poszukuje sprzęt pod cięższy aparat czy kamerę polecam wyższe modele (np 61).',
    'positive',
  ),
  entry(
    'Ok.',
    'neutral',
  ),
  entry(
    'Czyli dostałem najtańszy pokój, mimo ze zapłaciłem za podwyższony… Powrót do recepcji i wyjaśnianie sprawy.',
    'negative',
  ),
  entry(
    'Kolejny dobry rok odnotował segment energetyki konwencjonalnej.',
    'positive',
  ),
  entry(
    'Zgodnie z Uchwałą nr 4 NWZA z dnia 19 sierpnia 2011 roku skupione akcje własne mogą być przeznaczone na: a) umorzenie w drodze obniżenia kapitału zakładowego, b) lub do dalszej ich odsprzedaży, c) lub do zaoferowania ich do nabycia pracownikom Spółki lub podmiotom z nią powiązanym, a to w celu realizacji programu motywacyjnego, jeżeli taki zostanie uchwalony, w tym w szczególności do realizacji pracowniczych programów opcji na akcje lub innych przydziałów akcji pracownikom Spółki lub spółki z nią powiązanej.',
    'neutral',
  ),
  entry(
    'Niestety pokoju nie ma, pani skierowała mnie do złego skrzydła hotelu (sa cale dwa…).',
    'negative',
  ),
  entry(
    'Rosnące ceny energii stwarzają nowe możliwości w tym zakresie.',
    'positive',
  ),
  entry(
    '380 mln zł tj. 68%.',
    'neutral',
  ),
  entry(
    'Wiec znów powrót do recepcji i od początku szukanie.',
    'negative',
  ),
  entry(
    'Nasza spółka rozwijająca projekty farm fotowoltaicznych o łącznej mocy 8MW wygrała aukcję w 2018 r.',
    'positive',
  ),
  entry(
    'Przez cały 2018 r. obserwowaliśmy systematyczny wzrost cen energii elektrycznej na rynku spot i terminowym.',
    'neutral',
  ),
  entry(
    'W pokoju sterownik do klimatyzacji, ale oczywiście klima nie działa.',
    'negative',
  ),
  entry(
    'W segmencie dystrybucji realizacja wdrożonego w 2016 roku programu inwestycyjnego przebiega zgodnie z harmonogramem.',
    'positive',
  ),
  entry(
    'Byłem u dra Wilhelma na wykładzie i na ćwiczeniach....',
    'neutral',
  ),
  entry(
    'Całość jest tak akustyczna, ze miałem okazje wysłuchać nocnych rozmów Polaków przy wódce, odgłosów rzygania, sikania i paru innych.',
    'negative',
  ),
  entry(
    'Dodatkowo AmRest stanie się również największym franczyzobiorcą marki KFC w Hiszpanii.',
    'positive',
  ),
  entry(
    'Szacowany dług netto Spółki na dzień Finalizacji Umowy wynosi 32 miliony EUR.',
    'neutral',
  ),
  entry(
    'Niestety, nazwa zapowiada standard, o który ten hotel się nie ociera.',
    'negative',
  ),
  entry(
    'AmRest spodziewa się, że przejęcie Restauravia pozytywnie wpłynie na marże generowane przez AmRest i przyczyni się do zwiększenia wartości dodanej dla naszych akcjonariuszy.',
    'positive',
  ),
  entry(
    'Równocześnie akcjonariusze mniejszościowi posiadają opcje sprzedaży ("Opcja Put") całości lub części udziałów.',
    'neutral',
  ),
  entry(
    'Omijaj ten hotel szerokim łukiem!',
    'negative',
  ),
  entry(
    'Angielski B1/E Polecam Miałem z nią B1/E i bardzo dobrze wspominam te zajęcia.',
    'positive',
  ),
  entry(
    'Opcja Put może być wykonana po 3 i do 6 lat od dnia Finalizacji Umowy.',
    'neutral',
  ),
  entry(
    'Rozczarowuje jednak słabą konstrukcją, mała stabilnością oraz dośc niewygodną regulacją wysokości (nie mamy tu bowiem korbki,ale zwykła śrubę).',
    'negative',
  ),
  entry(
    'Ogólnie totalny luz.',
    'positive',
  ),
  entry(
    'Cena wykonania obu ww. opcji będzie równa 8,2 razy wysokości EBITDA za ostatnie 12 miesięcy, skorygowana o wartość długu netto w dniu wykonania opcji.',
    'neutral',
  ),
];

export const CLARIN_EMO_VALIDATION: RPEDatasetEntry[] = [
  entry(
    'Bardzo dużym minusem jest brak klimatyzacji - w naszym pokoju panowała Sauna.',
    'negative',
  ),
  entry(
    'Po trzech dniach otrzymałem wyjasnienie niepokojacych tematów, a potem na dodatkowe pytania w drugim mailu.',
    'positive',
  ),
  entry(
    'Miałem kontakt z seksuologiem mailowy.',
    'neutral',
  ),
  entry(
    'Pytanie pani z recepcji przy wymeldowywaniu: Czy korzystali Państwo z wody? ehhhh.....',
    'negative',
  ),
  entry(
    'Ja nie potrzebuje już seksuologa bo wyszły mi TYLKO braki w wiadomosciach.',
    'positive',
  ),
  entry(
    'Hotel położony nieopodal Koszalina.',
    'neutral',
  ),
  entry(
    'Do Pani Profesor trafiłam po 12 latach zmagań z różnymi lekarzami – najczęściej ginekologami i endokrynologami; mając za sobą różne diagnozy lub najczęściej ich brak, przeżywszy ogrom niekontrolowanych zachowań mojego organizmu po zażyciu całej masy przeróżnych niepotrzebnych ,,leków”, będąc rozchwiana hormonalnie i na granicy wyczerpania emocjonalnego.',
    'negative',
  ),
  entry(
    'Seksuolog nie miał tendencji do "stworzenia pacjenta" tylko uspokoił mnie.',
    'positive',
  ),
  entry(
    'Klient wypełnia klasyczny formularz, w którym wpisuje wszystkie potrzebne informacje, takie jak daty, ilość osób i specjalne wymagania.',
    'neutral',
  ),
  entry(
    'Wskutek całego ogromu nieprzyjemnych i często dramatycznych doznań zatraciłam wiarę w możliwości i umiejętności lekarzy.',
    'negative',
  ),
  entry(
    'Uważam że wart polecania jest lekarz z cechami spolecznymi, pracujący także bezinteresownie.',
    'positive',
  ),
  entry(
    'Mieliśmy pokój rodzinny z jednym podwójnym i jednym piętrowym łóżkiem; i z klimatyzacją.',
    'neutral',
  ),
  entry(
    'Ze względu na brak typowej kuchni nie ma praktycznie dań ciepłych.',
    'negative',
  ),
  entry(
    'Wysoki poziom już od samej recepcji, wszystko bardzo profesjonalne.',
    'positive',
  ),
  entry(
    'Rozwój franczyzy prowadzi do zwiększania liczby obiektów i pokoi w sieciach kosztem hoteli niezależnych.',
    'neutral',
  ),
  entry(
    'Mały wybór pieczywa, poziom wędlin i serów nie umywa się do polskiej kuchni - mortadela, salceson i tym podobne.',
    'negative',
  ),
  entry(
    'Wnętrze hotelu bardzo nowoczesne i świeże.',
    'positive',
  ),
  entry(
    'Wybierając hotel na dwutygodniowy pobyt w czasie ferii kierowałam się poza ofertą opiniami gości.',
    'neutral',
  ),
  entry(
    'Brak nieodzownej jajecznicy i kiełbasek, o plastrach bekonu nie wspominając.',
    'negative',
  ),
  entry(
    'Pokoje czyściutkie, bardzo ładne, nowoczesne multimedia ułatwiające pobyt.',
    'positive',
  ),
  entry(
    'Nie chcę nikomu narzucać lekarza.',
    'neutral',
  ),
  entry(
    'Brak serków świeżych, brak jakichkolwiek słodkich przekąsek do kawy.',
    'negative',
  ),
  entry(
    'Na terenie hotelu jest basen z pięknym widokiem na jezioro oraz profesjonalne spa - byłem naprawdę warto.',
    'positive',
  ),
  entry(
    'Te wyniki skłoniły naukowców do podjęcia pomiarów funkcji naczyń w okresach znacząco różniących się średnim zanieczyszczeniem powietrza.',
    'neutral',
  ),
  entry(
    'Cała masa produktów w mini pudełeczkach - dżem, miód, masło, serek, wyroby pasztetopodobne.',
    'negative',
  ),
  entry(
    'Hotelowa restauracja z urozmaiconymi śniadaniami, dobrze ułożona karta, doskonały dobór win.',
    'positive',
  ),
  entry(
    'Przeprowadzono badanie endoskopowe nosa i zatok przynosowych.',
    'neutral',
  ),
  entry(
    'Po drugiej stronie widok na parking lub park .Hotel najlepsze lata ma już za sobą.',
    'negative',
  ),
  entry(
    'Personel bardzo uprzejmy, pomocny.',
    'positive',
  ),
  entry(
    'U pan Łukasza byłem na dwóch wizytach.',
    'neutral',
  ),
  entry(
    'Zwłaszcza na zewnątrz budynku widać sporo braków .Pokoje w różnym standardzie .',
    'negative',
  ),
  entry(
    'Krótko mówiąc hotel wart polecenia, niemalże obowiązkowy w czasie pobytu na Mazurach.',
    'positive',
  ),
  entry(
    '"Są to badania bardzo wymagające jeśli chodzi o zaprojektowanie pomieszczeń.',
    'neutral',
  ),
  entry(
    'No taki sobie nocleg na jedną noc .',
    'negative',
  ),
  entry(
    'Pokoje średniej wielkości dosyć dobrze wyposażone.',
    'positive',
  ),
  entry(
    'Należy zadbać o odpowiednią rozgrzewkę i stopniowo zwiększać aktywność.',
    'neutral',
  ),
  entry(
    'Wybralismy sie z rodzinä i malutkim dzieckiem w listopadzie 2016 do Charlotty w celu spedzenia milego weekendu.Po 1 nocy zrezygnowalismy z pobytu...dlaczego..?oto kilka punktöw: W hotelu bylo chlodno,restauracja sprawiala wrazenie zamknietej, zimnej i pozbawionej jakiejkolwiek atmosfery;na prosbe mojä wläczono muzyke,jeden kelner mial problem z obslużeniem 2 stoliköw,aczkolwiek mily;jedzenie marne,i improwizowane(sznycel wiedenski z salatkä ziemniaczanä) czytaj pöl kotleta i ziemniaki z musztardä ?!?..deser stary (panacotta).bufet wieczorny...widac na zdjeciach,wyschniety chleb,nieschlodzone wedliny i sery,bardzo nieapetycznie podane,wrecz niezjadliwe.poköj (apartament)cena 1314 zl za 2 noce...brudna wykladzina ,gryzäcy zapach (odswiezacz..?!?)nieszczelne drzwi tarasowe,poplamione reczniki,miekki materac w lözku(posciel czysta),mimo canal +,4 programy,reszta czarno-biala,lodöwka -minibar-pusta,papierki po poprzednikach za szafkä,pajeczyny w rogach.....uff......basen ...1 wrazenie ok...ale woda w jakuzzi pieniäca sie...(bakterie) fuj.....;woda w basenie ciepla,ale po wläczeniu wodospadu znowu piana.moze ten hotel latem jest ok,ale w okresie jesiennym jest bardzo smutny.',
    'negative',
  ),
  entry(
    'Ciekawym miejscem w hotelu jest muzeum zabytkowych samochodów.',
    'positive',
  ),
  entry(
    'Ważne jest spokojne zakończenie ćwiczeń, ponieważ do zawału często dochodzi nie tylko w czasie wysiłku, ale i po jego zakończeniu.',
    'neutral',
  ),
  entry(
    'W restauracji wyboru nie był zbyt dużego, ponieważ dania gruzińskie z karty były nieobecne, podobnie było z winem, niestety tylko w karcie.',
    'negative',
  ),
  entry(
    'Dnia20 maja 2016 w szpitalu Św. Łukasza w Tarnowie roku została przeprowadzona u mnie operacja kręgosłupa (kręgozmyk kręgów L4, L5 7mm) Pomimo, że uszkodzenie kręgosłupa było bardzo duże i groził mi paraliż nóg, operacja została przeprowadzona skutecznie.',
    'positive',
  ),
  entry(
    'Przed wejściem na stok należy odczekać jakiś czas, aby organizm przyzwyczaił się do nowej temperatury i ciśnienia.',
    'neutral',
  ),
  entry(
    'Obsługa na niskim poziomie, podobnie jak otrzymane jedzenie po długim oczekiwaniu.',
    'negative',
  ),
  entry(
    'Dzięki czemu ustąpiły dolegliwości bólowe i dzisiaj poruszam się sprawnie o własnych siłach.',
    'positive',
  ),
  entry(
    'Kupiłam ten samouczek w zestawie z dwiema płytami.',
    'neutral',
  ),
  entry(
    'Nie polecam.',
    'negative',
  ),
  entry(
    'Pani Profesor jest lekarzem wybitnym, specjalistą na najwyższym poziomie, wiernie oddanym przysiędze Hipokratesa, a przede wszystkim osobą o szczerej chęci niesienia pomocy i bezgranicznej empatii.',
    'positive',
  ),
  entry(
    'W nawiązaniu do raportu bieżącego nr 44/2012 z dnia 6 listopada 2012 r.',
    'neutral',
  ),
  entry(
    'Odniosłam wrażenie, iż Pani doktor nie miała czasu i chciała jak najszybciej się mnie pozbyć.',
    'negative',
  ),
  entry(
    'Zazwyczaj po roku leczenia traciłam wiarę w kompetencje nowego lekarza prowadzącego; tym razem jest inaczej – powoli nabieram zaufania do jego umiejętności.',
    'positive',
  ),
  entry(
    'Prawo własności przemysłowej (tekst jedn.',
    'neutral',
  ),
  entry(
    'Bardzo wysokie ceny w spa.',
    'negative',
  ),
  entry(
    'Zawsze, gdy tego potrzebuję służy mi radą i wsparciem, a ponadto robi to bezinteresownie - z szlachetnej i czystej chęci niesienia pomocy.',
    'positive',
  ),
  entry(
    'Nabywca zorganizowanej części przedsiębiorstwa przejmuje zobowiązania związane z działalnością zbywanej zorganizowanej części przedsiębiorstwa według stanu na dzień 1 stycznia 2013 r.',
    'neutral',
  ),
  entry(
    'Basen jest bardzo mały.',
    'negative',
  ),
  entry(
    'Nigdy nie zwątpiłam w kompetencje i profesjonalizm Pani Profesor.',
    'positive',
  ),
  entry(
    'Opisana powyżej umowa zbycia wchodzi w życie z dniem 1 stycznia 2013 r.',
    'neutral',
  ),
  entry(
    'Deser też codziennie ten sam: budyń, kisiel.',
    'negative',
  ),
  entry(
    'Cisza i spokój, piękny ogród z atrakcjami dla dzieci i nie tylko.',
    'positive',
  ),
  entry(
    'Podstawa prawna: art. 56 ust. 1 pkt 1 Ustawy o ofercie – informacje poufne',
    'neutral',
  ),
];

export const CLARIN_EMO_TEST: RPEDatasetEntry[] = [
  entry(
    'Przez 12 lat leczyła mnie ze złym rozpoznaniem.',
    'negative',
  ),
  entry(
    'Teraz jestem leczony na prawidłową chorobę, biorę odpowiednie leki i od razu czuję się lepiej w porównaniu z tym co było.',
    'positive',
  ),
  entry(
    'Organizowałam w hotelu imprezę urodzinową na 40 osób.',
    'neutral',
  ),
  entry(
    'Na dodatek pani doktor nie raczyła poinformować mnie też, że leki, które kazała mi brać, powodują uszkodzenia i zniekształcenia płodu! (na szczęście moja dziewczyna nie zaszła w ciążę)',
    'negative',
  ),
  entry(
    'Podeszwa Air Max oraz ten srebrny kolor, coś pięknego.',
    'positive',
  ),
  entry(
    'Kupiłem ją dzieciom, bo ręcznymi szczoteczkami nie doczyszczały dokładnie zębów i odkładał się płytka przy dziąsłach.',
    'neutral',
  ),
  entry(
    'OSTRZEGAM!!',
    'negative',
  ),
  entry(
    'Poprzednią nogę operował inny doktor - noga ta była dużo gorsza, więc była operowana w pierwszej kolejności, nie spieszyło się doktorowi , zaznaczył szczegółowo wszystkie miejsca z żylakami, a następnie je zoperował.',
    'positive',
  ),
  entry(
    '869 hoteli ze 145 303 pokojami znajdowało się w budowie, zaawansowanym planowaniu i planowaniu w styczniu br. wynika z zestawienia Global Construction Pipeline Report przygotowanego przez firmę STR.',
    'neutral',
  ),
  entry(
    'Dj którego zapewnił organizator bladego pojęcia nie miał jaka imprezę będzie prowadził, był kompletnie nieprzygotowany, trzykrotnie mylił imię jubilatki, a wszelkie wcześniejsze ustalenia i zapewnienia menadżera okazały się pustymi słowami.',
    'negative',
  ),
  entry(
    'Jestem pacjętką doktora od 3 lat i naprawdę jestem zadowolona jest miły kompetentny do gabinetu na babanie ide na luzie bez stresu :) prowadzi mi ciążę chodzę do gabinetu na św.wojciecha ale usg robiłam prywatnie w medicusie zależało mi na tym żeby zrobić usg 4D i mieć pewność że wszystko jest wporządku pierwsze usg robiłam w 12 tyg było ok następne w 18tyg pomierzył wszystko co trzeba powiedział że będe miała córcie ale nie podobało mu się serce więc podał mi namiary na bardzo dobrego specjalistę od echa serca płodu w szczecinie i miałam pojechać na wizytę w międzyczasie dowiedział się że ze skierowaniem nie będę musiała płacić za badanie wypisał mi skierowanie i powiedział żebym umówiła sie na wizytę w 20tyg a nastepnego dnia po wizycie w Szczecinie mam przyjść do gabinetu z opisem co i jak.Po badaniu w Szczecinie doktor stwierdził że plamka jest ale jest nie grożna kamień spadł mi z serca.Natępnego dnia poszłam do doktora z opisem od specjalisty ze Szczecina widziałam w jego oczach tez ulge że wszytko jest wporządku.Naprawdę szczerze polecam świetny doktor .',
    'positive',
  ),
  entry(
    'W styczniu 2012 łańcuch rozwoju obejmował 866 hoteli z 139 700 pokojami.',
    'neutral',
  ),
  entry(
    'Zaledwie po 3 godzinach "zabawy" usłyszałam, ze napoi zimnych nie otrzymamy ponieważ już się skończyły choć umowa zawierała informację ze mamy je bez limitu.',
    'negative',
  ),
  entry(
    'Zalety: dobrze pierze.',
    'positive',
  ),
  entry(
    'W tym roku powstaje więc o 0,35 proc. hoteli i o 4 proc. pokoi więcej niż przed rokiem.',
    'neutral',
  ),
  entry(
    'Gdy następnego dnia próbowałam wyjaśnić cała sytuacje a przede wszystkim poinformować o wszystkim menadżera otrzymałam informacje, ze nieprawda jest to co mówię, napoi nikt nie obiecywał a żeby dodać sprawie pazura usłyszałam, ze jeden z moich gości nie uregulował należności za swój pokój.',
    'negative',
  ),
  entry(
    '"Wykorzystanie naszego oprogramowania ma umożliwić sprawną i rzetelną analizę filmów wykonywanych za pośrednictwem kamerki umieszczonej w kapsułce - mówi w rozmowie z PAP Dawid Jereczek z CTAdventure. - Tym samym skróci to czas potrzebny na analizę nagrania i zmniejszy liczbę godzin, jakie lekarz musi na nią poświęcić".',
    'positive',
  ),
  entry(
    'O ile w styczniu 2012 największym placem budowy hoteli był przygotowujący się do letnich igrzysk Londyn, w którym łańcuch rozwojowy obejmował 4 638 pokoi, to w styczniu br. najwięcej pokoi – 4 228 - powstawało w tureckim Stambule.Drugim z największych hotelowych placów budów pozostaje niezmiennie Moskwa, w której w tym roku powstaje 2 523 pokoje wobec 2 228 w styczniu 2012 r.',
    'neutral',
  ),
  entry(
    'Kiedy go poinformowałam ze owy gość rachunek uregulował i mam na to dowód kontakt się urwał.',
    'negative',
  ),
  entry(
    'Jereczek uważa natomiast, że gdyby wykorzystano oprogramowanie, koszt badania mógłby spaść co najmniej o połowę.',
    'positive',
  ),
  entry(
    'Więcej niż 1 000 pokoi powstaje jeszcze w Londynie – 2 181, Berlinie – 2 077 pokoi, Amsterdamie – 1 775 i Wiedniu 1 061 pokoi.Zdjęcia: Największym z obiektów realizowanych w Stambule jest obecnie liczący 829 pokoi i 11 tys. stóp kw. powierzchni konferencyjnej Hilton Istanbul Bomonti Hotel & Conference Center.',
    'neutral',
  ),
  entry(
    'Musiałem sobie kupić wkładki, ponieważ moja stopa leży za nisko i but uginał się u góry podczas chodzenia.',
    'negative',
  ),
  entry(
    'A wtedy więcej osób będzie sobie mogło pozwolić na profilaktykę" - wyraża nadzieję rozmówca PAP.',
    'positive',
  ),
  entry(
    'Na rynek amerykański produkt ma być wdrożony w 2020 r. a na rynek europejski - rok później. „W USA patent wygasa wcześniej, w Europie możemy to zrobić dopiero rok później” - wyjaśnił.',
    'neutral',
  ),
  entry(
    'Nie wiem, co jeszcze powinienem napisać, buty nie są najwygodniejszymi jakie w życiu miałem jednak tragedii nie ma.',
    'negative',
  ),
  entry(
    'Pokoje w widokiem na szlak, zawsze czyste, obsługa na najwyższym poziomie.',
    'positive',
  ),
  entry(
    'Zaznaczył, że prace nad jednym produktem trwają około ośmiu lat.',
    'neutral',
  ),
  entry(
    'Przykro mi, ale nie będę polecała nikomu tego lekarza.Dip.',
    'negative',
  ),
  entry(
    'Obfite urozmaicone śniadania, Dania restauracyjne smaczne i znów przemiła obsługa.',
    'positive',
  ),
  entry(
    'Tegoroczny obóz trwa od 5 do 26 lipca.',
    'neutral',
  ),
  entry(
    'Teraz badanie z wykorzystaniem kapsułki endoskopowej może kosztować nawet 4-5 tys. zł.',
    'negative',
  ),
  entry(
    'Szczoteczka sam w sobie jest dobra.',
    'positive',
  ),
  entry(
    'Byłam w tym Hotelu po raz trzeci.',
    'neutral',
  ),
  entry(
    'Niestety akumulator w tej szczoteczce jest słaby (technologia NiMH).',
    'negative',
  ),
  entry(
    'Pomocny jest też timer, który zmusza niejako dzieci do dokładniejszego mycia zębów.',
    'positive',
  ),
  entry(
    'Na globalnym rynku trzeba być przedsiębiorstwem dynamicznym i elastycznym.',
    'neutral',
  ),
  entry(
    'Trochę się tego spodziewałem, że nie będzie bardzo dobrze, ale oczekiwałem trochę więcej.',
    'negative',
  ),
  entry(
    'Ale na szczęście nie jest ciężka.',
    'positive',
  ),
  entry(
    'Nowa strategia uwzględnia unijne regulacje i plany w zakresie gospodarki niskoemisyjnej i elektromobilności.',
    'neutral',
  ),
  entry(
    'Potrafi się po prostu wyłączyć podczas mycia.',
    'negative',
  ),
  entry(
    'Sprzęt nie jest zły.',
    'positive',
  ),
  entry(
    'Nasi pracownicy, kontrahenci, dostawcy czy odbiorcy, a także szeroko rozumiani interesariusze, oczekują jasnych deklaracji i regulacji w zakresie kwestii etycznych.',
    'neutral',
  ),
  entry(
    'Myślałem, że ucierpią tylko moje walory estetyczne, jednakże przy próbie wykręcenia twardego dysku z komputera na małej śrubce poległ bit oznaczony jako 3/32 (płaski śrubokręt 2,5mm).',
    'negative',
  ),
  entry(
    'Pozytywne wrażenie pozostawiło SPA, przestronny basen z widokiem na jezioro i pyszne śniadanie:-)',
    'positive',
  ),
  entry(
    'Nie mam opinii o śniadaniu ponieważ nie korzystaliśmy z niego.',
    'neutral',
  ),
  entry(
    'byłam u pana doktora w lutym na usg,stwierdził ciążę obumarłą,z kpiną w głosie i uśmieszkiem na twarzy powiedział \'tak to jest jak jest się po trzydziestce" skierował do szpitala.po łyżeczkowaniu i 1 okresie poszłam na wizytę kontrolną,a on mi na to,że mnie nie przyjmie,bo im się pieniądze z funduszu skończyły i mam przyjść za 3tyg. obecnie jestem w 16tc.byłam w poradni,bo od paru dni nie czułam ruchów synka(a czułam je od 2 tyg regularnie) panie pielęgniarki pół godz skakały nade mną z detektorem i sprawdzały tętno,niestety nic nie wyczuły.pan doktor nie zbadał mnie na usg,nawet nie obejrzał mojego brzucha...bo miał wywiad do jakiejś gazety!!!!nie miał czasu!kazał tylko iść do szpitala na ostry dyżur. mój mąż jest wściekły,ja zrozpaczona całą tą sytuacją.',
    'negative',
  ),
  entry(
    'Doskonała łazienka, bardzo przyjemna, choć nie rozumiem, po co komu w niej telefon, skoro jeden już jest przy łóżku.W sumie jest to doskonały hotel na pobyt w Atenach, cena trochę ponad 100 euro za noc, ale warto.Nie zastanawiałbym sie nad innym hotelem w Atenach niż ten.',
    'positive',
  ),
  entry(
    'W szczególności należy zwrócić uwagę na: 1.',
    'neutral',
  ),
  entry(
    'Ma jednak kilka minusów: - trudno dostępne filmy (ja kupuję wysyłkowo w Amazon w USA, ale koszty przesyłki są wysokie) - filmy Hasselblada wymagają specjalnie wyposażonej ciemni jeśli fotografie mają być naprawdę dobrej jakości (to są kolejne koszty) - byłoby miło, gdyby zdjęcia były zapisywane nie tylko na filmie, ale także na karcie pamięci i tu pojawia się problem, bo ten sprzęt nie przetwarza cyfrowo obrazu Poza tym ok.',
    'negative',
  ),
  entry(
    'Kurs: Informacja Patentowa Ocena: W porządku[/b] Pan Kotarba to bardzo przyjazny i idący na ręke wykładowca.',
    'positive',
  ),
  entry(
    'Strata to jest konsekwencja dokonania odpisów księgowych, podyktowanych restrukturyzacją największych — historycznie problematycznych projektów oraz porządkowaniem sytuacji w Grupie Kapitałowej, o czym szerzej w pkt.III poniżej.',
    'neutral',
  ),
  entry(
    'Niestety czar pryska po przekroczeniu drzwi hotelu:-( Obsługa bardzo uprzejma ale totalnie nieprofesjonalna, nie sądzę by była to wyszkolona kadra hotelowa.',
    'negative',
  ),
  entry(
    'Obsługa była przemiła, na stole w pokoju czekały na nas słodkości (przepyszne!).',
    'positive',
  ),
  entry(
    'Aktualnie trwa proces weryfikacji zainteresowania potencjalnych inwestorów zakupem Sygnity Business Solutions.',
    'neutral',
  ),
];

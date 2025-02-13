import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';



import { Heading } from '../../components/Heading';
import { Background } from '../../components/Background';
import { DuoCard, DuoCardProps} from '../../components/DuoCard';
import { DuoMatch } from '../../components/DuoMatch';

import { TouchableOpacity, View, Image, FlatList, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons'
import logoImg from '../../assets/logo-nlw-esports.png'


import { styles } from './styles';
import { GameParams } from '../../@types/navigation';
import { THEME } from '../../theme';



interface RouteParams {
  id: string;
  title: string;
  bannerUrl: string;
}


export function Game() {
  const [duos, setDuos] = useState<DuoCardProps[]>([]);
  const [discordDuoSelected, setDiscordDuoSelected] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const game = route.params as GameParams;

  function handleGoback() {
    navigation.goBack();
  }

  async function getDiscordUser(ads: string){
    fetch(`http://localhost:3333/ads/${ads}/discord`)
    .then(response => response.json())
    .then(data => setDiscordDuoSelected(data.discord));
  }

  useEffect(() => {
    fetch(`http://localhost:3333/games/${game.id}/ads`)
    .then(response => response.json())
    .then(data => setDuos(data));
  }, [])

  return (
    <Background>
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleGoback}>
                  <Entypo 
                    name='chevron-thin-left'
                    color={THEME.COLORS.CAPTION_300}
                    size={20}
                  />
              </TouchableOpacity>

              <Image 
                source={logoImg}
                style={styles.logo}
              />

              <View style={styles.right}/>
            </View>

            <Image 
              source={{ uri: game.bannerUrl }}
              style={styles.cover}
              resizeMode="cover"
            />

           <Heading 
             title={game.title}
             subtitle="Conecte-se e comece a jogar!" 
           />

           <FlatList 
              data={duos}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <DuoCard 
                  data={item}
                  onConnect={() => getDiscordUser(item.id)} 
                />
              )}
              horizontal
              style={styles.containerList}
              contentContainerStyle={[ duos.length > 0 ? styles.contentList : styles.emptyListContent]}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={() => (
                <Text style={styles.emptyListText}>
                  Não há anúcios publicados ainda.
                </Text>
              )}
           />

           <DuoMatch 
              visible={discordDuoSelected.length > 0}
              discord={discordDuoSelected}
              onClose={() => setDiscordDuoSelected('')}
           />
        </SafeAreaView>
    </Background>
  );
}
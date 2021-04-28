import { GetStaticProps } from "next";
import Image from "next/image";
import { api } from "../services/api";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import styles from './home.module.scss';

type Episode = {
    id: string;
    url: string; 
    title: string;
    members: string;
    duration:number;
    thumbnail: string;   
    description: string;
    publishedAt: string;
    durationAsString: string;
}
 
type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home(props: HomeProps) {

  return(
    <>
      <div className={styles.homepage}>
        <section className={styles.latestEpisodes}>
            <h2>Últimos Lançamentos</h2>

            <ul>
              {props.latestEpisodes.map(episode => {
                return(
                  <li key={episode.id}>
                    <Image 
                      width={192} 
                      height={192} 
                      src={episode.thumbnail} 
                      alt={episode.title}
                      objectFit="cover" 
                    />

                    <div className={styles.episodeDetails}>
                      <a href="">{episode.title}</a>
                      <p>{episode.members}</p>
                      <span>{episode.publishedAt}</span>
                      <span>{episode.durationAsString}</span>


                      <button type="button">
                        <img src="/play-green.svg" alt="Tocar episódio"/>
                      </button>
                    </div>

                  </li>
                );
              })}
            </ul>
        </section>


        <section className={styles.allEpisodes}>
              <h2>Todos Episódios</h2>

              <table cellSpacing={0}>
                <thead>
                  <th></th>
                  <th>Podcast</th>
                  <th>Integrantes</th>
                  <th>Data</th>
                  <th>Duração</th>
                  <th></th>
                </thead>

                <tbody>
                  {props.allEpisodes.map(episode => {
                    return (
                      <tr key={episode.id}>
                        <td style={{ width: 80}}>
                          <Image 
                            width={120}
                            height={120}
                            src={episode.thumbnail}
                            alt={episode.title}
                            objectFit="cover"
                          />
                        </td>
                        <td>
                          <a href="">{episode.title}</a>
                        </td>
                        <td>{episode.members}</td>
                        <td style={{ width: 100}}>{episode.publishedAt}</td>
                        <td>{episode.durationAsString}</td>
                        <td>
                          <button type="button">
                            <img src="/play-green.svg"/>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
        </section>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps =  async () =>  {

  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc', 
    }
  });
  
  const episode = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members, 
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    }
  });

  const latestEpisodes = episode.slice(0, 2);
  const allEpisodes = episode.slice(2, episode.length); 

  return {
    props: {
      episodes: episode,
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, 
  }

}
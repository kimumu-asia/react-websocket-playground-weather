import React, { lazy, useCallback, useEffect, useState, Suspense } from 'react';
import { Center, Grid, GridItem, Flex, Stack, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { useWebSocketContext } from '../context/WebSocketProvider';

const Thunderstorm = lazy(() => import('../assets/rain.svg?react'));
const Drizzle = lazy(() => import('../assets/drizzle.svg?react'));
const Rain = lazy(() => import('../assets/rain.svg?react'));
const Snow = lazy(() => import('../assets/snow.svg?react'));
const Atmosphere = lazy(() => import('../assets/atmosphere.svg?react'));
const Clear = lazy(() => import('../assets/clear.svg?react'));
const Clouds = lazy(() => import('../assets/clouds.svg?react'));

const Sunset = lazy(() => import('../assets/sunset.svg?react'));
const Sunrise = lazy(() => import('../assets/sunrise.svg?react'));

export const DataIndicator = () => {
  const { socket, connected } = useWebSocketContext();
  const [weather, setWeather] = useState();

  useEffect(() => {
    if (socket) {
      socket.on('weatherUpdate', (response) => {
        setWeather(response);
      });
    }

    return () => {
      if (socket) {
        socket.off('weatherUpdate');
      }
    };
  }, [socket]);

  const getActiveCloudComponent = useCallback(() => {
    switch (weather?.weather[0].main) {
      case 'Thunderstorm':
        return <Thunderstorm />;
      case 'Drizzle':
        return <Drizzle />;
      case 'Rain':
        return <Rain />;
      case 'Snow':
        return <Snow />;
      case 'Atmosphere':
        return <Atmosphere />;
      case 'Clear':
        return <Clear />;
      case 'Clouds':
        return <Clouds />;
      default:
        return null;
    }
  }, [weather]);

  const getGradientBackground = (type) => {
    const weatherGradientColorset = {
      Thunderstorm: '#80008069 0%, #800080 100%',
      Drizzle: '#e0eafc 0%, #cfdef3',
      Rain: '#a8edea 0%, #fed6e3 100%',
      Snow: '#e6e9f0 0%, #eef1f5 100%',
      Atmosphere: '##e2e8f0ad 0%, #eef1f5 100%',
      Clear: '#f5af19 0%, #f12711 100%',
      Clouds: '#dcecfb4f 0%, #dcecfb 100%',
    };
    const linear = weatherGradientColorset[type];
    return `linear(to-b, ${linear})`;
  };

  return (
    <Flex
      minH="80vh"
      maxH="100vh"
      align="center"
      justify="center"
      wrap="wrap"
      bgGradient={getGradientBackground(weather?.weather[0].main)}
    >
      <Stack w="full" boxShadow={'2xl'} rounded={'xl'} p={8} margin={12} spacing={4} align={'center'} minH={'60vh'}>
        <Stack align="center">
          <Heading textTransform={'uppercase'} fontSize={'2xl'} color={useColorModeValue('gray.800', 'gray.200')}>
            Olympic Bridge
          </Heading>
          <Text fontSize="xs" w="full" align="center">
            {weather?.weather[0].description}
          </Text>
        </Stack>
        <Flex position="relative" maxWidth="300px" wrap="wrap">
          <Text position="absolute" top="5" left="12" as="b" opacity="0.9" fontSize={90}>
            {weather ? `${weather.main.temp.toFixed(1)}°` : ''}
          </Text>
          <Suspense>{getActiveCloudComponent()}</Suspense>
        </Flex>
        <Grid maxWidth="480px" templateColumns="1fr 1fr 1fr" gap={4}>
          <GridItem w="100%" alignItems="center" color="purple" bg="white" p="2" rounded="md">
            <Text fontSize="xs" w="full">
              체감온도
              <Text fontSize="xs" w="full">
                {weather?.main.feels_like}%
              </Text>
            </Text>
          </GridItem>
          <GridItem w="100%" alignItems="center" color="purple" bg="white" p="2" rounded="md">
            <Text fontSize="xs" w="full">
              습도
            </Text>
            <Text fontSize="xs" w="full">
              {weather?.main.humidity}%
            </Text>
          </GridItem>
          <GridItem w="100%" alignItems="center" color="purple" bg="white" p="2" rounded="md">
            <Text fontSize="xs" w="full">
              기압
            </Text>
            <Text fontSize="xs" w="full">
              {weather?.main.pressure}
            </Text>
          </GridItem>
        </Grid>
        <Flex w="full" align={'center'} border="gray.500">
          <Grid w="full" templateRows="1fr 1fr 1fr" gap={1}>
            <GridItem>
              <Sunrise w="20" h="20" style={{ margin: '0 auto' }} />
            </GridItem>
            <GridItem>
              <Text w="full">Sunrise</Text>
            </GridItem>
            <GridItem>
              <Text w="full">
                {new Date(weather?.sys.sunrise * 1000).toLocaleString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </GridItem>
          </Grid>
          <Grid templateRows="1fr 1fr 1fr" gap={1}>
            <GridItem>
              <Sunset w="20" h="20" style={{ margin: '0 auto' }} />
            </GridItem>
            <GridItem>
              <Text>Sunset</Text>
            </GridItem>
            <GridItem>
              <Text w="36">
                {new Date(weather?.sys.sunset * 1000).toLocaleString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </GridItem>
          </Grid>
        </Flex>
      </Stack>
    </Flex>
  );
};

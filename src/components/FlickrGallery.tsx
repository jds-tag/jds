// src/components/FlickrGallery.tsx
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { H3 } from '@/components/Headings';

// Define the interface we're going to use to store API data.
interface FlickrPhoto {
  id: string;
  url: string;
  title: string;
  description: string;
}

interface FlickrSize {
  label: string;
  width: string;
  height: string;
  source: string;
  url: string;
  media: string;
}

export default function FlickrGallery() {
  const [photos, setPhotos] = useState<FlickrPhoto[]>([]);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const photosetRes = await axios.get(
          'https://api.flickr.com/services/rest/',
          {
            params: {
              method: 'flickr.photosets.getPhotos',
              api_key: process.env.NEXT_PUBLIC_FLICKR_API_KEY,
              photoset_id: '72177720326182006',
              user_id: '200633048@N05',
              format: 'json',
              nojsoncallback: 1,
            },
          },
        );

        const photos: FlickrPhoto[] = photosetRes.data.photoset.photo;

        const results = await Promise.all(
          photos.map(async (photo: FlickrPhoto) => {
            const sizeRes = await axios.get(
              'https://api.flickr.com/services/rest/',
              {
                params: {
                  method: 'flickr.photos.getSizes',
                  api_key: process.env.NEXT_PUBLIC_FLICKR_API_KEY,
                  photo_id: photo.id,
                  format: 'json',
                  nojsoncallback: 1,
                },
              },
            );

            const sizes: FlickrSize[] = sizeRes.data.sizes.size;
            const largest = sizes.reduce((prev, current) =>
              parseInt(current.width) > parseInt(prev.width) ? current : prev,
            );

            const infoRes = await axios.get(
              'https://api.flickr.com/services/rest/',
              {
                params: {
                  method: 'flickr.photos.getInfo',
                  api_key: process.env.NEXT_PUBLIC_FLICKR_API_KEY,
                  photo_id: photo.id,
                  format: 'json',
                  nojsoncallback: 1,
                },
              },
            );
            const description = infoRes.data.photo.description._content;

            return {
              id: photo.id,
              url: largest.source,
              title: photo.title,
              description: description,
            };
          }),
        );
        setPhotos(results);
      } catch (error) {
        console.error('Error fetching flickr photo', error);
      }
    };

    fetchPhoto();
  }, []);

  return (
    <div>
      {photos.length > 0 ? (
        <div className="relative">
          {photos.map((photo, i) => (
            <div key={i}>
              <div className="mx-auto flex flex-col lg:flex-row font-sans">
                {i % 2 === 0 ? (
                  <>
                    {/* Image first */}
                    <div className="lg:w-1/2">
                      <Image
                        className="aspect-square object-cover"
                        src={photo.url}
                        alt={photo.title + '–' + photo.description}
                        width={1920}
                        height={1920}
                      />
                    </div>
                    {/* Text second */}
                    <div className="pt-4 pb-4 lg:w-1/2 bg-amber-100 flex justify-center items-center flex-col">
                      <H3>{photo.title}</H3>
                      <p>{photo.description}</p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Text first desktop */}
                    <div className="hidden lg:flex lg:w-1/2 bg-emerald-100 justify-center items-center flex-col">
                      <H3>{photo.title}</H3>
                      <p>{photo.description}</p>
                    </div>
                    {/* Image second */}
                    <div className="lg:w-1/2">
                      <Image
                        className="aspect-square object-cover"
                        src={photo.url}
                        alt={photo.title + '–' + photo.description}
                        width={1920}
                        height={1920}
                      />
                    </div>
                    {/* Text second mobile only */}
                    <div className="flex pt-4 pb-4 lg:hidden lg:w-1/2 bg-emerald-100 justify-center items-center flex-col">
                      <H3>{photo.title}</H3>
                      <p>{photo.description}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading images...</p>
      )}
    </div>
  );
}

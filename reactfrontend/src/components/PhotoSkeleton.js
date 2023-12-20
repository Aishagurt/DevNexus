import React from 'react';
import { Skeleton } from '@mui/material';

const PhotoSkeleton = () => {
    const skeletonHeight = 400;
    const skeletonWidth = '100%';

    return (
        <div style={{ width: '100%', height: skeletonHeight, marginBottom: 20 }}>
            <Skeleton variant="rectangular" width={skeletonWidth} height={skeletonHeight} animation="wave" />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px' }}>
                <Skeleton variant="text" width={120} height={20} animation="wave" />
                <Skeleton variant="text" width={50} height={20} animation="wave" />
            </div>
        </div>
    );
};

export default PhotoSkeleton;

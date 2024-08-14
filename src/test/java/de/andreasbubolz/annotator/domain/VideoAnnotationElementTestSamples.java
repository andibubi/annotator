package de.andreasbubolz.annotator.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class VideoAnnotationElementTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static VideoAnnotationElement getVideoAnnotationElementSample1() {
        return new VideoAnnotationElement().id(1L).startSec(1).stopSec(1).videoId("videoId1").videoStartSec(1);
    }

    public static VideoAnnotationElement getVideoAnnotationElementSample2() {
        return new VideoAnnotationElement().id(2L).startSec(2).stopSec(2).videoId("videoId2").videoStartSec(2);
    }

    public static VideoAnnotationElement getVideoAnnotationElementRandomSampleGenerator() {
        return new VideoAnnotationElement()
            .id(longCount.incrementAndGet())
            .startSec(intCount.incrementAndGet())
            .stopSec(intCount.incrementAndGet())
            .videoId(UUID.randomUUID().toString())
            .videoStartSec(intCount.incrementAndGet());
    }
}

package de.andreasbubolz.annotator.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AnnotationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Annotation getAnnotationSample1() {
        return new Annotation().id(1L).videoId("videoId1");
    }

    public static Annotation getAnnotationSample2() {
        return new Annotation().id(2L).videoId("videoId2");
    }

    public static Annotation getAnnotationRandomSampleGenerator() {
        return new Annotation().id(longCount.incrementAndGet()).videoId(UUID.randomUUID().toString());
    }
}

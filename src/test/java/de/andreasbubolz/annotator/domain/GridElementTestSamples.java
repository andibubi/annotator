package de.andreasbubolz.annotator.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class GridElementTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static GridElement getGridElementSample1() {
        return new GridElement().id(1L).x(1).y(1).w(1).h(1).channel("channel1").renderer("renderer1").content("content1");
    }

    public static GridElement getGridElementSample2() {
        return new GridElement().id(2L).x(2).y(2).w(2).h(2).channel("channel2").renderer("renderer2").content("content2");
    }

    public static GridElement getGridElementRandomSampleGenerator() {
        return new GridElement()
            .id(longCount.incrementAndGet())
            .x(intCount.incrementAndGet())
            .y(intCount.incrementAndGet())
            .w(intCount.incrementAndGet())
            .h(intCount.incrementAndGet())
            .channel(UUID.randomUUID().toString())
            .renderer(UUID.randomUUID().toString())
            .content(UUID.randomUUID().toString());
    }
}

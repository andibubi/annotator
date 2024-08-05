package de.andreasbubolz.annotator.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class TextAnnotationElementTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static TextAnnotationElement getTextAnnotationElementSample1() {
        return new TextAnnotationElement().id(1L).startSec(1).text("text1");
    }

    public static TextAnnotationElement getTextAnnotationElementSample2() {
        return new TextAnnotationElement().id(2L).startSec(2).text("text2");
    }

    public static TextAnnotationElement getTextAnnotationElementRandomSampleGenerator() {
        return new TextAnnotationElement()
            .id(longCount.incrementAndGet())
            .startSec(intCount.incrementAndGet())
            .text(UUID.randomUUID().toString());
    }
}

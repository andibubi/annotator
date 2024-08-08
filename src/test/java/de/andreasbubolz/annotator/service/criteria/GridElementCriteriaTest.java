package de.andreasbubolz.annotator.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class GridElementCriteriaTest {

    @Test
    void newGridElementCriteriaHasAllFiltersNullTest() {
        var gridElementCriteria = new GridElementCriteria();
        assertThat(gridElementCriteria).is(criteriaFiltersAre(filter -> filter == null));
    }

    @Test
    void gridElementCriteriaFluentMethodsCreatesFiltersTest() {
        var gridElementCriteria = new GridElementCriteria();

        setAllFilters(gridElementCriteria);

        assertThat(gridElementCriteria).is(criteriaFiltersAre(filter -> filter != null));
    }

    @Test
    void gridElementCriteriaCopyCreatesNullFilterTest() {
        var gridElementCriteria = new GridElementCriteria();
        var copy = gridElementCriteria.copy();

        assertThat(gridElementCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter == null)),
            criteria -> assertThat(criteria).isEqualTo(gridElementCriteria)
        );
    }

    @Test
    void gridElementCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var gridElementCriteria = new GridElementCriteria();
        setAllFilters(gridElementCriteria);

        var copy = gridElementCriteria.copy();

        assertThat(gridElementCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter != null)),
            criteria -> assertThat(criteria).isEqualTo(gridElementCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var gridElementCriteria = new GridElementCriteria();

        assertThat(gridElementCriteria).hasToString("GridElementCriteria{}");
    }

    private static void setAllFilters(GridElementCriteria gridElementCriteria) {
        gridElementCriteria.id();
        gridElementCriteria.x();
        gridElementCriteria.y();
        gridElementCriteria.w();
        gridElementCriteria.h();
        gridElementCriteria.content();
        gridElementCriteria.displayAfterMillis();
        gridElementCriteria.displayDurationMillis();
        gridElementCriteria.layoutId();
        gridElementCriteria.gridElementId();
        gridElementCriteria.gridElementsId();
        gridElementCriteria.distinct();
    }

    private static Condition<GridElementCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getX()) &&
                condition.apply(criteria.getY()) &&
                condition.apply(criteria.getW()) &&
                condition.apply(criteria.getH()) &&
                condition.apply(criteria.getContent()) &&
                condition.apply(criteria.getDisplayAfterMillis()) &&
                condition.apply(criteria.getDisplayDurationMillis()) &&
                condition.apply(criteria.getLayoutId()) &&
                condition.apply(criteria.getGridElementId()) &&
                condition.apply(criteria.getGridElementsId()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<GridElementCriteria> copyFiltersAre(GridElementCriteria copy, BiFunction<Object, Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getX(), copy.getX()) &&
                condition.apply(criteria.getY(), copy.getY()) &&
                condition.apply(criteria.getW(), copy.getW()) &&
                condition.apply(criteria.getH(), copy.getH()) &&
                condition.apply(criteria.getContent(), copy.getContent()) &&
                condition.apply(criteria.getDisplayAfterMillis(), copy.getDisplayAfterMillis()) &&
                condition.apply(criteria.getDisplayDurationMillis(), copy.getDisplayDurationMillis()) &&
                condition.apply(criteria.getLayoutId(), copy.getLayoutId()) &&
                condition.apply(criteria.getGridElementId(), copy.getGridElementId()) &&
                condition.apply(criteria.getGridElementsId(), copy.getGridElementsId()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}

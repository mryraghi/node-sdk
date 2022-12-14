import t from 'tap'
import {
  isAggregate,
  isFeatureDefinition,
  isFeatureName,
  isFeatureNameVersioned,
  isFeatures,
  isFeatureTier,
  isInterval,
  isMode,
  isModel,
  isOrgName,
  isPlan,
  isPlanName,
} from '../'

t.test('isMode', t => {
  t.ok(isMode('graduated'))
  t.ok(isMode('volume'))
  t.notOk(isMode(true))
  t.notOk(isMode('true'))
  t.notOk(isMode(null))
  t.notOk(isMode(false))
  t.end()
})

t.test('isAggregate', t => {
  t.ok(isAggregate('sum'))
  t.ok(isAggregate('max'))
  t.ok(isAggregate('last'))
  t.ok(isAggregate('perpetual'))
  t.notOk(isAggregate(true))
  t.notOk(isAggregate('true'))
  t.notOk(isAggregate(null))
  t.notOk(isAggregate(false))
  t.end()
})

t.test('isInterval', t => {
  t.ok(isInterval('@daily'))
  t.ok(isInterval('@weekly'))
  t.ok(isInterval('@monthly'))
  t.ok(isInterval('@yearly'))
  t.notOk(isInterval(true))
  t.notOk(isInterval('true'))
  t.notOk(isInterval(null))
  t.notOk(isInterval(false))
  t.end()
})

t.test('isFeatureTier', t => {
  t.ok(isFeatureTier({}))
  t.ok(isFeatureTier({ base: 123 }))
  t.ok(isFeatureTier({ price: 1 }))
  t.ok(isFeatureTier({ upto: 2 }))
  t.notOk(isFeatureTier(null))
  t.notOk(isFeatureTier({ base: 'hello' }))
  t.notOk(isFeatureTier({ base: 1.2 }))
  t.notOk(isFeatureTier({ price: 'hello' }))
  t.notOk(isFeatureTier({ price: 1.2 }))
  t.notOk(isFeatureTier({ upto: 'hello' }))
  t.notOk(isFeatureTier({ upto: 1.2 }))
  t.end()
})

t.test('isFeatures', t => {
  t.ok(isFeatures('feature:foo@plan:blah@1'))
  // XXX: change once we have a 'features' section in pj, perhaps
  t.notOk(isFeatures('feature:foo@123'))
  t.ok(isFeatures('plan:foo@1'))
  t.notOk(isFeatures('feature:foo'))
  t.notOk(isFeatures('plan:foo'))
  t.notOk(isFeatures(null))
  t.notOk(isFeatures(''))
  t.notOk(isFeatures(true))
  t.end()
})

t.test('isFeatureNameVersioned', t => {
  t.ok(isFeatureNameVersioned('feature:foo@plan:blah@1'))
  // XXX: change once we have a 'features' section in pj, perhaps
  t.notOk(isFeatureNameVersioned('feature:foo@123'))
  t.notOk(isFeatureNameVersioned('plan:foo@1'))
  t.notOk(isFeatureNameVersioned('feature:foo'))
  t.notOk(isFeatureNameVersioned('plan:foo'))
  t.notOk(isFeatureNameVersioned(null))
  t.notOk(isFeatureNameVersioned(''))
  t.notOk(isFeatureNameVersioned(true))
  t.end()
})

t.test('isFeatureName', t => {
  t.ok(isFeatureName('feature:foo'))
  t.notOk(isFeatureName('feature:'))
  t.notOk(isFeatureName('feature:foo@plan:blah@1'))
  t.notOk(isFeatureName('feature:foo@123'))
  t.notOk(isFeatureName('plan:foo@1'))
  t.notOk(isFeatureName('plan:foo'))
  t.notOk(isFeatureName(null))
  t.notOk(isFeatureName(''))
  t.notOk(isFeatureName(true))
  t.end()
})

t.test('isPlanName', t => {
  t.ok(isPlanName('plan:foo@1'))
  t.notOk(isPlanName('feature:foo'))
  t.notOk(isPlanName('feature:foo@plan:blah@1'))
  t.notOk(isPlanName('feature:foo@123'))
  t.notOk(isPlanName('plan:foo'))
  t.notOk(isPlanName(null))
  t.notOk(isPlanName(''))
  t.notOk(isPlanName(true))
  t.end()
})

t.test('isOrgName', t => {
  t.ok(isOrgName('org:whatever'))
  t.notOk(isOrgName('org:'))
  t.notOk(isOrgName('org'))
  t.notOk(isOrgName({ toString: () => 'org:x' }))
  t.notOk(isOrgName(true))
  t.notOk(isOrgName(null))
  t.end()
})

t.test('isFeatureDefinition', t => {
  t.ok(isFeatureDefinition({}))
  t.ok(isFeatureDefinition({ tiers: [] }))
  t.ok(isFeatureDefinition({ title: 'x', base: 1, aggregate: 'sum' }))
  t.ok(
    isFeatureDefinition({
      title: 'x',
      mode: 'graduated',
      tiers: [{}],
    })
  )

  // cannot have base and tiers together
  t.notOk(isFeatureDefinition({ title: 'x', base: 1, tiers: [] }))
  t.notOk(
    isFeatureDefinition({
      mode: 'not a valid mode',
    })
  )
  t.notOk(
    isFeatureDefinition({
      tiers: 'tiers not an array',
    })
  )
  t.notOk(
    isFeatureDefinition({
      tiers: [{ base: 'tiers valid' }],
    })
  )
  t.notOk(isFeatureDefinition({ base: 123, aggregate: 'yolo' }))
  t.end()
})

t.test('isPlan', t => {
  t.notOk(isPlan(null))
  t.notOk(isPlan(true))
  t.notOk(
    isPlan({
      title: { not: 'a string' },
    })
  )
  t.notOk(
    isPlan({
      features: {
        'not a feature name': {},
      },
    })
  )
  t.ok(isPlan({}))
  t.ok(
    isPlan({
      features: {
        'feature:name': {},
      },
    })
  )
  t.notOk(
    isPlan({
      currency: { not: 'a currency string' },
    })
  )
  t.ok(
    isPlan({
      currency: 'usd',
    })
  )
  t.notOk(
    isPlan({
      interval: { not: 'an interval string' },
    })
  )
  t.notOk(
    isPlan({
      interval: 'not an interval string',
    })
  )
  t.ok(
    isPlan({
      interval: '@monthly',
    })
  )
  t.end()
})

t.test('isModel', t => {
  t.notOk(isModel(null))
  t.notOk(isModel(true))
  t.notOk(isModel({}))
  t.ok(isModel({ plans: {} }))
  t.ok(isModel({ plans: { 'plan:p@0': {} } }))
  t.notOk(isModel({ plans: { 'not a plan name': {} } }))
  t.notOk(
    isModel({
      plans: {
        'plan:notaplan@0': {
          features: {
            'not a feature name': {},
          },
        },
      },
    })
  )
  t.end()
})
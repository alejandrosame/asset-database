import { processFilename } from './ImageUploaderModal';

it('processes filename front side', () => {
  const obj = processFilename("70900 Zombie_A[FANE,FDMS].png");
  expect(obj).toEqual(
    { number: "70900",
      name: "Zombie",
      side: "front"
    }
  )
});

it('processes filename back side', () => {
  const obj = processFilename("70900 Zombie_B[FANE,FDMS,SLS].png");
  expect(obj).toEqual(
    { number: "70900",
      name: "Zombie",
      side: "back"
    }
  )
});

it('processes filename name with spaces side', () => {
  const obj = processFilename("70910 Zombie_dog_B[FANE,FDMS,SLS].png");
  expect(obj).toEqual(
    { number: "70910",
      name: "Zombie dog",
      side: "back"
    }
  )
});

it('fails for wrong number field', () => {
  const obj = processFilename("70a910 Zombie_dog_B[FANE,FDMS,SLS].png");
  expect(obj).toEqual(
    expect.objectContaining({
      errorMsg: "Could not extract number from filename."
    })
  )
});

it('fails for wrong side field', () => {
  const obj = processFilename("70910 Zombie_dog_C[FANE,FDMS,SLS].png");
  expect(obj).toEqual(
    expect.objectContaining({
      errorMsg: "Could not extract side from filename."
    })
  )
});


it('fails for wrong wrong format', () => {
  const obj = processFilename("70910 Zombie_dog_A_FANE,FDMS,SLS.png");
  expect(obj).toEqual(
    expect.objectContaining({
      errorMsg: "Could not extract side from filename."
    })
  )
});

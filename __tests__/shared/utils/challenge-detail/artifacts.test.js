import downloadArtifacts from 'utils/challenge-detail/artifacts';
import { downloadSubmissions } from 'services/submissions';
import { compressFiles } from 'utils/files';

jest.mock('services/submissions', () => ({ downloadSubmissions: jest.fn() }));
jest.mock('utils/files', () => ({
  compressFiles: jest.fn((files, name, finish) => finish()),
  getExtensionFromMime: type => (type === 'text/plain' ? 'txt' : 'zip'),
}));

describe('artifact downloads', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    downloadSubmissions.mockResolvedValue(new Blob(['artifact'], { type: 'text/plain' }));
  });

  it('downloads every artifact into uniquely named files in one ZIP', async () => {
    const ids = ['example-internal', 'example', 'provisional-internal', 'system-internal'];
    await downloadArtifacts('token', 'submission-id', ids);
    expect(downloadSubmissions.mock.calls).toEqual(ids.map(id => ['token', 'submission-id', id]));
    const [files, filename] = compressFiles.mock.calls[0];
    expect(files.map(file => file.name)).toEqual(ids.map(id => `${id}.txt`));
    expect(filename).toBe('submission-artifacts-submission-id.zip');
  });

  it('does not save a partial archive when any download fails', async () => {
    downloadSubmissions.mockRejectedValueOnce(new Error('Forbidden'));
    await expect(downloadArtifacts('token', 'id', ['example', 'system-internal']))
      .rejects.toThrow('Forbidden');
    expect(compressFiles).not.toHaveBeenCalled();
  });

  it('does not try to download an empty archive', async () => {
    await downloadArtifacts('token', 'id', []);
    expect(downloadSubmissions).not.toHaveBeenCalled();
    expect(compressFiles).not.toHaveBeenCalled();
  });

  it('saves an individual artifact with its name and releases its object URL', async () => {
    const create = window.URL.createObjectURL;
    const revoke = window.URL.revokeObjectURL;
    window.URL.createObjectURL = jest.fn(() => 'blob:artifact');
    window.URL.revokeObjectURL = jest.fn();
    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    await downloadArtifacts('token', 'id', 'example');
    expect(click.mock.instances[0].download).toBe('submission-id-example.txt');
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:artifact');
    expect(compressFiles).not.toHaveBeenCalled();
    click.mockRestore();
    window.URL.createObjectURL = create;
    window.URL.revokeObjectURL = revoke;
  });
});
